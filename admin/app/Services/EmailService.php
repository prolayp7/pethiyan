<?php

namespace App\Services;

use App\Enums\SettingTypeEnum;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    protected array $emailConfig;

    public function __construct(SettingService $settingService)
    {
        $setting           = $settingService->getSettingByVariable(SettingTypeEnum::EMAIL());
        $this->emailConfig = $setting?->value ?? [];
    }

    /**
     * Dynamically apply SMTP settings from the database to the mail config,
     * then send a Mailable.
     *
     * @param  \Illuminate\Mail\Mailable  $mailable
     * @param  string|array               $to       Recipient email(s)
     * @param  string|null                $name     Recipient display name
     */
    public function send($mailable, string|array $to, ?string $name = null): bool
    {
        if (empty($this->emailConfig['smtpHost']) || empty($this->emailConfig['smtpEmail'])) {
            Log::warning('[EmailService] SMTP not configured — skipping email.');
            return false;
        }

        try {
            $this->applySmtpConfig();

            $mailer = Mail::mailer('smtp');

            if ($name) {
                $mailer->to($to, $name)->send($mailable);
            } else {
                $mailer->to($to)->send($mailable);
            }

            return true;

        } catch (\Throwable $e) {
            Log::error('[EmailService] Send failed: ' . $e->getMessage(), [
                'to'       => $to,
                'mailable' => get_class($mailable),
            ]);
            return false;
        }
    }

    /**
     * Override the runtime mail configuration with stored SMTP settings.
     */
    protected function applySmtpConfig(): void
    {
        Config::set('mail.mailers.smtp', [
            'transport'  => 'smtp',
            'host'       => $this->emailConfig['smtpHost']        ?? '',
            'port'       => (int)($this->emailConfig['smtpPort']  ?? 587),
            'encryption' => $this->emailConfig['smtpEncryption']  ?? 'tls',
            'username'   => $this->emailConfig['smtpEmail']       ?? '',
            'password'   => $this->emailConfig['smtpPassword']    ?? '',
            'timeout'    => null,
        ]);

        Config::set('mail.from', [
            'address' => $this->emailConfig['smtpEmail'] ?? config('mail.from.address'),
            'name'    => config('app.name'),
        ]);
    }

    public function isConfigured(): bool
    {
        return !empty($this->emailConfig['smtpHost']) && !empty($this->emailConfig['smtpEmail']);
    }
}
