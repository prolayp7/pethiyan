import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:go_router/go_router.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../../../core/constants/api_constants.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../controllers/checkout_controller.dart';

/// Centralises all payment gateway launch logic.
/// Rule: never trust client callback alone — always poll order status after.
class PaymentLauncher {
  static Future<void> launch(
    BuildContext context,
    WidgetRef ref,
    CheckoutState checkout,
  ) async {
    switch (checkout.selectedPaymentMethod) {
      case 'razorpay':
        await _launchRazorpay(context, ref, checkout);
      case 'stripe':
        await _launchStripe(context, ref, checkout);
      case 'easepay':
        await _launchWebView(context, ref, checkout, ApiConstants.easepayCreate);
      default:
        // paystack, flutterwave — similar SDK pattern, scaffold shown
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${checkout.selectedPaymentMethod} coming soon')),
        );
    }
  }

  // ── Razorpay ───────────────────────────────────────────────────────────
  static Future<void> _launchRazorpay(
    BuildContext context,
    WidgetRef ref,
    CheckoutState checkout,
  ) async {
    final client = await ref.read(dioClientProvider.future);

    // Step 1: create gateway order
    final createRes = await client.post(ApiConstants.razorpayCreate, data: {
      'address_id':     checkout.selectedAddress!['id'],
      if (checkout.promoCode != null) 'promo_code': checkout.promoCode,
    });
    final gatewayOrderId = createRes.data['data']['gateway_order_id'] as String;
    final amount         = createRes.data['data']['amount'] as int; // in paise
    final razorpayKey    = createRes.data['data']['key'] as String;
    final orderId        = createRes.data['data']['order_id'] as String;

    final completer = Completer<bool>();
    final razorpay  = Razorpay();

    razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, (_) {
      if (!completer.isCompleted) completer.complete(true);
    });
    razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, (_) {
      if (!completer.isCompleted) completer.complete(false);
    });
    razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, (_) {
      if (!completer.isCompleted) completer.complete(false);
    });

    // Step 2: open SDK
    razorpay.open({
      'key':         razorpayKey,
      'amount':      amount,
      'order_id':    gatewayOrderId,
      'name':        'LCommerce',
      'description': 'Order #$orderId',
    });

    final sdkSuccess = await completer.future;
    razorpay.clear();

    if (!context.mounted) return;

    // Step 3: Poll order status regardless of SDK result
    // Webhook may confirm payment even if SDK reports error
    await _pollAndNavigate(context, ref, orderId, sdkSuccess);
  }

  // ── Stripe ─────────────────────────────────────────────────────────────
  static Future<void> _launchStripe(
    BuildContext context,
    WidgetRef ref,
    CheckoutState checkout,
  ) async {
    final client = await ref.read(dioClientProvider.future);

    final createRes = await client.post(ApiConstants.stripeCreate, data: {
      'address_id': checkout.selectedAddress!['id'],
      if (checkout.promoCode != null) 'promo_code': checkout.promoCode,
    });

    final clientSecret = createRes.data['data']['client_secret'] as String;
    final orderId      = createRes.data['data']['order_id'] as String;

    await Stripe.instance.initPaymentSheet(
      paymentSheetParameters: SetupPaymentSheetParameters(
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'LCommerce',
      ),
    );

    try {
      await Stripe.instance.presentPaymentSheet();
      if (context.mounted) {
        await _pollAndNavigate(context, ref, orderId, true);
      }
    } on StripeException {
      if (context.mounted) {
        await _pollAndNavigate(context, ref, orderId, false);
      }
    }
  }

  // ── WebView (Easepay / Easebuzz) ───────────────────────────────────────
  static Future<void> _launchWebView(
    BuildContext context,
    WidgetRef ref,
    CheckoutState checkout,
    String createEndpoint,
  ) async {
    final client = await ref.read(dioClientProvider.future);
    final createRes = await client.post(createEndpoint, data: {
      'address_id': checkout.selectedAddress!['id'],
      if (checkout.promoCode != null) 'promo_code': checkout.promoCode,
    });

    final paymentUrl = createRes.data['data']['payment_url'] as String;
    final orderId    = createRes.data['data']['order_id'] as String;

    if (!context.mounted) return;

    final success = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (_) => _PaymentWebView(
          url: paymentUrl,
          successUrlPattern: 'lcommerce/payment/success',
          failureUrlPattern: 'lcommerce/payment/failure',
        ),
      ),
    );

    if (context.mounted) {
      await _pollAndNavigate(context, ref, orderId, success ?? false);
    }
  }

  // ── Poll order status after payment ───────────────────────────────────
  static Future<void> _pollAndNavigate(
    BuildContext context,
    WidgetRef ref,
    String orderId,
    bool sdkSuccess,
  ) async {
    // Show "processing" state while polling
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const AlertDialog(
        content: Row(children: [
          CircularProgressIndicator(),
          SizedBox(width: 16),
          Text('Confirming payment...'),
        ]),
      ),
    );

    final client   = await ref.read(dioClientProvider.future);
    String? orderSlug;

    for (var i = 0; i < AppConstants.paymentPollMaxAttempts; i++) {
      await Future.delayed(
          const Duration(seconds: AppConstants.paymentPollIntervalSec));
      try {
        final res = await client.get('${ApiConstants.orders}/$orderId',
            forceRefresh: true);
        final status   = res.data['data']?['status'] as String?;
        orderSlug      = res.data['data']?['slug'] as String?;
        final isPaid   = status == 'confirmed' || status == 'processing';
        if (isPaid) break;
      } catch (_) {}
    }

    if (context.mounted) Navigator.pop(context); // close dialog

    if (!context.mounted) return;

    if (orderSlug != null) {
      ref.read(checkoutProvider.notifier).reset();
      context.go('/order-confirmation/$orderSlug');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Payment processing. Check your orders for status.'),
        duration: Duration(seconds: 5),
      ));
      context.go('/orders');
    }
  }
}

// ── WebView screen ─────────────────────────────────────────────────────────
class _PaymentWebView extends StatefulWidget {
  final String url;
  final String successUrlPattern;
  final String failureUrlPattern;
  const _PaymentWebView({
    required this.url,
    required this.successUrlPattern,
    required this.failureUrlPattern,
  });

  @override
  State<_PaymentWebView> createState() => _PaymentWebViewState();
}

class _PaymentWebViewState extends State<_PaymentWebView> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(NavigationDelegate(
        onNavigationRequest: (req) {
          if (req.url.contains(widget.successUrlPattern)) {
            Navigator.pop(context, true);
            return NavigationDecision.prevent;
          }
          if (req.url.contains(widget.failureUrlPattern)) {
            Navigator.pop(context, false);
            return NavigationDecision.prevent;
          }
          return NavigationDecision.navigate;
        },
      ))
      ..loadRequest(Uri.parse(widget.url));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('Payment'),
      leading: IconButton(
        icon: const Icon(Icons.close),
        onPressed: () => Navigator.pop(context, false),
      ),
    ),
    body: WebViewWidget(controller: _controller),
  );
}

// OrderConfirmationScreen is defined in order_confirmation_screen.dart
