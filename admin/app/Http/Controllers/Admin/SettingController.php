<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SettingTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\SettingService;
use App\Services\TotpService;
use App\Types\Api\ApiResponseType;
use App\Types\Settings\AppSettingType;
use App\Types\Settings\AuthenticationSettingType;
use App\Types\Settings\HomeGeneralSettingType;
use App\Types\Settings\DeliveryBoySettingType;
use App\Types\Settings\GstSettingType;
use App\Types\Settings\SmsSettingType;
use App\Types\Settings\EmailSettingType;
use App\Types\Settings\NotificationSettingType;
use App\Types\Settings\PaymentSettingType;
use App\Types\Settings\StorageSettingType;
use App\Types\Settings\SystemSettingType;
use App\Types\Settings\WebSettingType;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class SettingController extends Controller
{
    use AuthorizesRequests;

    private const PAYMENT_UNLOCK_SESSION_KEY = 'admin_payment_settings_unlocked_at';
    private const PAYMENT_UNLOCK_TTL_MINUTES = 10;

    protected SettingService $settingService;
    protected TotpService $totpService;

    public function __construct(SettingService $settingService, TotpService $totpService)
    {
        $this->settingService = $settingService;
        $this->totpService = $totpService;
    }


    public function index(): View
    {
        try {
            $this->authorize('viewAny', Setting::class);
        } catch (AuthorizationException $e) {
            abort(403, __('labels.unauthorized_access'));
        }
        return view('admin.settings.all_settings');
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'type' => ['required', new Enum(SettingTypeEnum::class)],
            ]);

            $type = $request->input('type');

            if ($type === SettingTypeEnum::PAYMENT() && !$this->isPaymentSettingsUnlocked($request)) {
                return ApiResponseType::sendJsonResponse(
                    success: false,
                    message: __('Please verify admin password and authenticator code to edit payment settings.'),
                    data: []
                );
            }

            // Map setting type to the corresponding class
            $method = match ($type) {
                SettingTypeEnum::SYSTEM() => SystemSettingType::class,
                SettingTypeEnum::STORAGE() => StorageSettingType::class,
                SettingTypeEnum::EMAIL() => EmailSettingType::class,
                SettingTypeEnum::PAYMENT() => PaymentSettingType::class,
                SettingTypeEnum::AUTHENTICATION() => AuthenticationSettingType::class,
                SettingTypeEnum::NOTIFICATION() => NotificationSettingType::class,
                SettingTypeEnum::WEB() => WebSettingType::class,
                SettingTypeEnum::APP() => AppSettingType::class,
                SettingTypeEnum::DELIVERY_BOY() => DeliveryBoySettingType::class,
                SettingTypeEnum::HOME_GENERAL_SETTINGS() => HomeGeneralSettingType::class,
                SettingTypeEnum::SMS() => SmsSettingType::class,
                SettingTypeEnum::GST() => GstSettingType::class,
                default => null,
            };

            if (!$method) {
                return ApiResponseType::sendJsonResponse(
                    success: false,
                    message: __('labels.invalid_type'),
                    data: []
                );
            }

            $setting = Setting::find($type);
            $existingValues = is_array($setting?->value) ? $setting->value : [];
            $payload = $request->all();

            // Some file widgets submit existing media URLs/paths as plain strings.
            // Strip those non-file values before validation and preserve existing value later.
            if ($type === SettingTypeEnum::SYSTEM()) {
                foreach (['logo', 'favicon', 'adminSignature'] as $mediaField) {
                    if (!$request->hasFile($mediaField)) {
                        unset($payload[$mediaField]);
                    }
                }
            }

            // Initialize settings object from request data
            $settings = $method::fromArray($payload);

            if ($type === SettingTypeEnum::SYSTEM()) {
                foreach (['logo', 'favicon', 'adminSignature'] as $mediaField) {
                    if (!$request->hasFile($mediaField) && !empty($existingValues[$mediaField])) {
                        $settings->{$mediaField} = $existingValues[$mediaField];
                    }
                }
            }

            // Handle media uploads
            $this->handleMediaUploads($request, $settings);

            // Prepare data for storage
            $data = [
                'variable' => $type,
                'value' => $settings->toJson(),
            ];

            // Authorize the module-wise update action
            try {
                $this->authorize('updateSetting', [Setting::class, $type]);
            } catch (AuthorizationException $e) {
                return ApiResponseType::sendJsonResponse(
                    success: false,
                    message: __('labels.unauthorized_access'),
                    data: []
                );
            }

            // Update or create setting
            if ($setting) {
                $setting->update($data);
                return ApiResponseType::sendJsonResponse(
                    success: true,
                    message: __('labels.setting_updated_successfully', ['type' => ucfirst(Str::replace('_', ' ', $type))]),
                    data: $setting
                );
            }

            $res = Setting::create($data);
            return ApiResponseType::sendJsonResponse(
                success: true,
                message: __('labels.setting_created_successfully', ['type' => $type]),
                data: $res
            );
        } catch (ValidationException $e) {
            $firstError = collect($e->errors())->flatten()->first();
            return ApiResponseType::sendJsonResponse(
                success: false,
                message: __('labels.validation_failed') . ': ' . $firstError,
                data: $e->errors()
            );
        }
    }

    /**
     * Handle media file uploads and assign paths to the settings object.
     *
     * @param Request $request
     * @param mixed $settings
     * @return void
     */
    private function handleMediaUploads(Request $request, $settings): void
    {
        $mediaFields = [
            'logo' => [
                'name' => fn($file) => 'logo-' . time() . '.' . $file->getClientOriginalExtension(),
                'path' => 'settings'
            ],

            'favicon' => [
                'name' => fn($file) => 'favicon-' . time() . '.' . $file->getClientOriginalExtension(),
                'path' => 'settings'
            ],

            'siteHeaderDarkLogo' => [
                'name' => fn($file) => 'site-header-dark-logo-' . time() . '.' . $file->getClientOriginalExtension(),
                'path' => 'settings'
            ],

            'siteHeaderLogo' => [
                'name' => fn($file) => 'site-header-logo-' . time() . '.' . $file->getClientOriginalExtension(),
                'path' => 'settings'
            ],

            'siteFooterLogo' => [
                'name' => fn($file) => 'site-footer-logo-' . time() . '.' . $file->getClientOriginalExtension(),
                'path' => 'settings'
            ],

            'siteFavicon' => [
                'name' => fn($file) => 'site-favicon-' . time() . '.' . $file->getClientOriginalExtension(),
                'path' => 'settings'
            ],

            'backgroundImage' => [
                'name' => fn($file) => uniqid() . '-' . $file->getClientOriginalName(),
                'path' => 'settings'
            ],

            'icon' => [
                'name' => fn($file) => uniqid() . '-' . $file->getClientOriginalName(),
                'path' => 'settings'
            ],

            'activeIcon' => [
                'name' => fn($file) => uniqid() . '-' . $file->getClientOriginalName(),
                'path' => 'settings'
            ],

            'serviceAccountFile' => ['name' => 'service-account-file.json', 'path' => 'settings', 'disk' => 'local'],
            'pwaLogo192x192' => [
                'name' => fn($file) => 'pwa-logo-192x192-' . time() . '.png',
                'path' => 'pwa_logos'
            ],

            'pwaLogo512x512' => [
                'name' => fn($file) => 'pwa-logo-512x512-' . time() . '.png',
                'path' => 'pwa_logos'
            ],

            'pwaLogo144x144' => [
                'name' => fn($file) => 'pwa-logo-144x144-' . time() . '.png',
                'path' => 'pwa_logos'
            ],

            'adminSignature' => [
                'name' => fn($file) => 'admin-signature-' . time() . '.' . $file->getClientOriginalExtension(),
                'path' => 'settings'
            ],
        ];

        foreach ($mediaFields as $field => $config) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $fileName = is_callable($config['name']) ? $config['name']($file) : $config['name'];
                $disk = $config['disk'] ?? 'public';
                $path = $file->storeAs($config['path'], $fileName, $disk);
                $settings->$field = $path;
            }
        }
    }

    public function show($variable): \Illuminate\Http\RedirectResponse|View
    {
        try {

            $setting_variable = SettingTypeEnum::values();
            if (!in_array($variable, $setting_variable)) {
                abort(404, __('labels.invalid_type'));
            }

            if ($variable === SettingTypeEnum::WEB()) {
                return redirect()->route('admin.settings.show', ['setting' => SettingTypeEnum::SYSTEM()]);
            }

            $transformedSetting = $this->settingService->getSettingByVariable($variable);

            if (!$transformedSetting) {
                abort(404, __('labels.setting_not_found'));;
            }
            // Authorize module-wise view access
            $this->authorize('viewSetting', [Setting::class, $variable]);
            $settings = $transformedSetting->toArray(request())['value'] ?? [];
            $webSettings = [];
            if ($variable === SettingTypeEnum::SYSTEM()) {
                $webTransformedSetting = $this->settingService->getSettingByVariable(SettingTypeEnum::WEB());
                $webSettings = $webTransformedSetting?->toArray(request())['value'] ?? [];
            }

            $setting = Setting::find(SettingTypeEnum::AUTHENTICATION());
            $googleApiKey = $setting->value['googleApiKey'] ?? null;
            return view('admin.settings.' . $variable, [
                'settings' => $settings,
                'webSettings' => $webSettings,
                'googleApiKey' => $googleApiKey,
                'paymentSettingsUnlocked' => $variable === SettingTypeEnum::PAYMENT()
                    ? $this->isPaymentSettingsUnlocked(request())
                    : false,
                'paymentUnlockTtlMinutes' => self::PAYMENT_UNLOCK_TTL_MINUTES,
            ]);
        } catch (AuthorizationException $e) {
            abort(403, __('labels.unauthorized_access'));
        } catch (\Throwable $e) {
            if ($e instanceof HttpExceptionInterface) {
                throw $e;
            }
            abort(500, __('labels.something_went_wrong'));
        }
    }

    public function unlockPaymentSettings(Request $request): JsonResponse
    {
        try {
            $this->authorize('updateSetting', [Setting::class, SettingTypeEnum::PAYMENT()]);
        } catch (AuthorizationException $e) {
            return ApiResponseType::sendJsonResponse(
                success: false,
                message: __('labels.unauthorized_access'),
                data: [],
                status: 403
            );
        }

        $validated = $request->validate([
            'password' => 'required|string',
            'totp_code' => 'required|string|size:6',
        ]);

        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return ApiResponseType::sendJsonResponse(false, __('labels.unauthorized_access'), [], 401);
        }

        if (!Hash::check($validated['password'], $admin->password)) {
            return ApiResponseType::sendJsonResponse(false, __('Invalid password.'), [], 422);
        }

        if (!$admin->isTotpEnabled()) {
            return ApiResponseType::sendJsonResponse(false, __('Admin TOTP is not enabled.'), [], 422);
        }

        if (!$this->totpService->verifyCode($admin->totp_secret, trim($validated['totp_code']))) {
            return ApiResponseType::sendJsonResponse(false, __('Invalid authenticator code.'), [], 422);
        }

        $request->session()->put(self::PAYMENT_UNLOCK_SESSION_KEY, now()->timestamp);

        return ApiResponseType::sendJsonResponse(true, __('Payment settings unlocked.'), [
            'unlocked' => true,
            'expires_in_seconds' => self::PAYMENT_UNLOCK_TTL_MINUTES * 60,
        ]);
    }

    public function lockPaymentSettings(Request $request): JsonResponse
    {
        $request->session()->forget(self::PAYMENT_UNLOCK_SESSION_KEY);

        return ApiResponseType::sendJsonResponse(true, __('Payment settings locked.'), [
            'unlocked' => false,
        ]);
    }

    private function isPaymentSettingsUnlocked(Request $request): bool
    {
        $unlockedAt = $request->session()->get(self::PAYMENT_UNLOCK_SESSION_KEY);
        if (empty($unlockedAt)) {
            return false;
        }

        $isValid = now()->timestamp <= ((int) $unlockedAt + (self::PAYMENT_UNLOCK_TTL_MINUTES * 60));
        if (!$isValid) {
            $request->session()->forget(self::PAYMENT_UNLOCK_SESSION_KEY);
        }

        return $isValid;
    }

}
