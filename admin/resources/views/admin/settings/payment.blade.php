@php use App\Enums\Payment\PaymentTypeEnum; @endphp
@extends('layouts.admin.app', ['page' => $menuAdmin['settings']['active'] ?? "", 'sub_page' => $menuAdmin['settings']['route']['payment']['sub_active'] ?? "" ])

@section('title', __('labels.payment_settings'))

@section('header_data')
    @php
        $page_title = __('labels.payment_settings');
        $page_pretitle = __('labels.admin') . " " . __('labels.settings');
    @endphp
@endsection

@php
    $breadcrumbs = [
        ['title' => __('labels.home'), 'url' => route('admin.dashboard')],
        ['title' => __('labels.settings'), 'url' => route('admin.settings.index')],
        ['title' => __('labels.payment_settings'), 'url' => null],
    ];
@endphp

@section('admin-content')
    <div class="page-header d-print-none">
        <div class="row g-2 align-items-center">
            <div class="col">
                <h2 class="page-title">{{ __('labels.payment_settings') }}</h2>
                <x-breadcrumb :items="$breadcrumbs"/>
            </div>
        </div>
    </div>
    <!-- BEGIN PAGE BODY -->
    <div class="page-body">
        <div class="container-xl">
            <div class="row g-5">
                <div class="col-sm-2 d-none d-lg-block">
                    <div class="sticky-top">
                        <h3>{{ __('labels.menu') }}</h3>
                        <nav class="nav nav-vertical nav-pills" id="pills">
                            <a class="nav-link" href="#pills-razorpay">{{ __('labels.razorpay_payment') }}</a>
                            <a class="nav-link" href="#pills-easepay">Easebuzz</a>
                            <a class="nav-link" href="#pills-cod">{{ __('labels.cash_on_delivery') }}</a>
                        </nav>
                    </div>
                </div>
                <div class="col-sm" data-bs-spy="scroll" data-bs-target="#pills" data-bs-offset="0">
                    <div class="row row-cards">
                        <div class="col-12">
                            <form action="{{ route('admin.settings.store') }}" class="form-submit" method="post">
                                @csrf
                                <input type="hidden" name="type" value="payment">

                                {{-- ============================================================ --}}
                                {{-- Razorpay --}}
                                {{-- ============================================================ --}}
                                <div class="card mb-4" id="pills-razorpay">
                                    <div class="card-header">
                                        <h4 class="card-title">{{ __('labels.razorpay_payment') }}</h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label class="row">
                                                <span class="col">{{ __('labels.enable_razorpay_payment') }}</span>
                                                <span class="col-auto">
                                                    <label class="form-check form-check-single form-switch">
                                                        <input class="form-check-input" type="checkbox"
                                                               name="razorpayPayment" value="1" {{ isset($settings['razorpayPayment']) && $settings['razorpayPayment'] ? 'checked' : '' }} />
                                                    </label>
                                                </span>
                                            </label>
                                        </div>
                                        <div id="razorpayFields"
                                             style="{{ isset($settings['razorpayPayment']) && $settings['razorpayPayment'] ? 'display: block;' : 'display: none;' }}">
                                            <div class="mb-3">
                                                <label class="form-label required">{{ __('labels.razorpay_payment_mode') }}</label>
                                                <select class="form-select" name="razorpayPaymentMode">
                                                    <option value="" disabled {{ !isset($settings['razorpayPaymentMode']) ? 'selected' : '' }}>{{ __('labels.razorpay_payment_mode_placeholder') }}</option>
                                                    <option value="test" {{ isset($settings['razorpayPaymentMode']) && $settings['razorpayPaymentMode'] === 'test' ? 'selected' : '' }}>Test</option>
                                                    <option value="live" {{ isset($settings['razorpayPaymentMode']) && $settings['razorpayPaymentMode'] === 'live' ? 'selected' : '' }}>Live</option>
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label required">{{ __('labels.razorpay_key_id') }}</label>
                                                <input type="text" class="form-control" name="razorpayKeyId"
                                                       placeholder="{{ __('labels.razorpay_key_id_placeholder') }}"
                                                       value="{{ $settings['razorpayKeyId'] ?? '' }}"/>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label required">{{ __('labels.razorpay_secret_key') }}</label>
                                                <input type="text" class="form-control" name="razorpaySecretKey"
                                                       placeholder="{{ __('labels.razorpay_secret_key_placeholder') }}"
                                                       value="{{ ($systemSettings['demoMode'] ?? false) ? Str::mask(($settings['razorpaySecretKey'] ?? '****'), '****', 3, 8) : ($settings['razorpaySecretKey'] ?? '') }}"/>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label required">{{ __('labels.razorpay_webhook_secret') }}</label>
                                                <input type="text" class="form-control" name="razorpayWebhookSecret"
                                                       placeholder="{{ __('labels.razorpay_webhook_secret_placeholder') }}"
                                                       value="{{ $settings['razorpayWebhookSecret'] ?? '' }}"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {{-- ============================================================ --}}
                                {{-- Easebuzz (Easepay) --}}
                                {{-- ============================================================ --}}
                                <div class="card mb-4" id="pills-easepay">
                                    <div class="card-header">
                                        <h4 class="card-title">Easebuzz <span class="badge bg-blue-lt ms-1">India</span></h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label class="row">
                                                <span class="col">Enable Easebuzz Payment</span>
                                                <span class="col-auto">
                                                    <label class="form-check form-check-single form-switch">
                                                        <input class="form-check-input" type="checkbox"
                                                               name="easepayPayment" value="1"
                                                               {{ isset($settings['easepayPayment']) && $settings['easepayPayment'] ? 'checked' : '' }} />
                                                    </label>
                                                </span>
                                            </label>
                                        </div>
                                        <div id="easepayFields"
                                             style="{{ isset($settings['easepayPayment']) && $settings['easepayPayment'] ? 'display:block;' : 'display:none;' }}">
                                            <div class="mb-3">
                                                <label class="form-label required">Payment Mode</label>
                                                <select class="form-select" name="easepayPaymentMode">
                                                    <option value="" disabled {{ !isset($settings['easepayPaymentMode']) ? 'selected' : '' }}>Select mode</option>
                                                    <option value="test" {{ ($settings['easepayPaymentMode'] ?? '') === 'test' ? 'selected' : '' }}>Test</option>
                                                    <option value="live" {{ ($settings['easepayPaymentMode'] ?? '') === 'live' ? 'selected' : '' }}>Live</option>
                                                </select>
                                                <small class="form-hint">Test uses <code>testpay.easebuzz.in</code>; Live uses <code>pay.easebuzz.in</code></small>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label required">Merchant Key</label>
                                                <input type="text" class="form-control" name="easepayMerchantKey"
                                                       placeholder="XXXXXXXXXX"
                                                       value="{{ ($systemSettings['demoMode'] ?? false) ? \Illuminate\Support\Str::mask(($settings['easepayMerchantKey'] ?? ''), '*', 3) : ($settings['easepayMerchantKey'] ?? '') }}">
                                                <small class="form-hint">Available in your Easebuzz merchant dashboard.</small>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label required">Merchant Salt</label>
                                                <input type="password" class="form-control" name="easepayMerchantSalt"
                                                       placeholder="••••••••••••••••"
                                                       value="{{ ($systemSettings['demoMode'] ?? false) ? '' : ($settings['easepayMerchantSalt'] ?? '') }}">
                                                <small class="form-hint">Used to generate hash signatures for all API calls.</small>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Webhook Secret</label>
                                                <input type="text" class="form-control" name="easepayWebhookSecret"
                                                       placeholder="optional"
                                                       value="{{ ($systemSettings['demoMode'] ?? false) ? '' : ($settings['easepayWebhookSecret'] ?? '') }}">
                                                <small class="form-hint">
                                                    Webhook URL: <code>{{ url('/api/easepay/webhook') }}</code>
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {{-- ============================================================ --}}
                                {{-- Cash on Delivery --}}
                                {{-- ============================================================ --}}
                                <div class="card mb-4" id="pills-cod">
                                    <div class="card-header">
                                        <h4 class="card-title">{{ __('labels.cash_on_delivery') }}</h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label class="row">
                                                <span class="col">{{ __('labels.enable_cash_on_delivery') }}</span>
                                                <span class="col-auto">
                                                    <label class="form-check form-check-single form-switch">
                                                        <input class="form-check-input" type="checkbox"
                                                               name="{{PaymentTypeEnum::COD()}}"
                                                               value="1" {{ isset($settings['cod']) && $settings['cod'] ? 'checked' : '' }} />
                                                    </label>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="card-footer text-end">
                                    <div class="d-flex">
                                        @can('updateSetting', [\App\Models\Setting::class, 'payment'])
                                            <button type="submit"
                                                    class="btn btn-primary ms-auto">{{ __('labels.submit') }}</button>
                                        @endcan
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- END PAGE BODY -->
@endsection

@push('script')
    <script>
        (function () {
            const razorpayToggle = document.querySelector('input[name="razorpayPayment"]');
            const razorpayFields = document.getElementById('razorpayFields');
            const easepayToggle  = document.querySelector('input[name="easepayPayment"]');
            const easepayFields  = document.getElementById('easepayFields');

            const toggleRazorpayFields = () => {
                razorpayFields.style.display = razorpayToggle.checked ? 'block' : 'none';
            };
            const toggleEasepayFields = () => {
                easepayFields.style.display = easepayToggle.checked ? 'block' : 'none';
            };

            razorpayToggle.addEventListener('change', toggleRazorpayFields);
            easepayToggle.addEventListener('change', toggleEasepayFields);
            toggleRazorpayFields();
            toggleEasepayFields();
        })();
    </script>
@endpush
