import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConstants {
  ApiConstants._();

  static String get baseUrl => dotenv.env['API_BASE_URL'] ?? '';

  // Auth
  static const String sendOtp     = '/api/auth/otp/send';
  static const String verifyOtp   = '/api/auth/otp/verify';
  static const String resendOtp   = '/api/auth/otp/resend';
  static const String login       = '/api/login';
  static const String register    = '/api/register';
  static const String logout      = '/api/logout';
  static const String forgotPassword = '/api/forget-password';
  static const String verifyUser  = '/api/verify-user';
  static const String googleCallback = '/api/auth/google/callback';
  static const String appleCallback  = '/api/auth/apple/callback';

  // Settings
  static const String settings         = '/api/settings';
  static const String settingVariables = '/api/settings/variables';
  static const String paymentVariables = '/api/payment/variables';
  static const String firebaseConfig   = '/api/settings/firebase-config';

  // Catalog
  static const String banners          = '/api/banners';
  static const String categories       = '/api/categories';
  static const String subCategories    = '/api/categories/sub-categories';
  static const String brands           = '/api/brands';
  static const String products         = '/api/products';
  static const String productSearch    = '/api/products/search-by-keywords';
  static const String featuredSections = '/api/featured-sections';
  static const String stores           = '/api/stores';
  static const String faqs             = '/api/faqs';

  // Delivery zone
  static const String deliveryZone      = '/api/delivery-zone';
  static const String deliveryZoneCheck = '/api/delivery-zone/check';

  // User
  static const String userProfile   = '/api/user/profile';
  static const String userAddresses = '/api/user/addresses';

  // Cart
  static const String cart          = '/api/user/cart';
  static const String cartAdd       = '/api/user/cart/add';
  static const String cartSync      = '/api/user/cart/sync';
  static const String cartClear     = '/api/user/cart/clear-cart';

  // Wishlist
  static const String wishlists     = '/api/user/wishlists';

  // Promos
  static const String promosAvailable = '/api/user/promos/available';
  static const String promosValidate  = '/api/user/promos/validate';

  // Orders
  static const String orders        = '/api/user/orders';
  static const String orderTransactions = '/api/user/order-transactions';

  // Wallet
  static const String wallet             = '/api/user/wallet';
  static const String walletTransactions = '/api/user/wallet/transactions';
  static const String walletRecharge     = '/api/user/wallet/prepare-wallet-recharge';
  static const String walletDeduct       = '/api/user/wallet/deduct-balance';

  // Reviews
  static const String reviews          = '/api/reviews';
  static const String sellerFeedback   = '/api/seller-feedback';

  // Support
  static const String supportTickets   = '/api/user/support-tickets';
  static const String supportTicketTypes = '/api/support-ticket-types';

  // Payment gateways
  static const String razorpayCreate   = '/api/razorpay/create-order';
  static const String razorpayWebhook  = '/api/webhook/razorpay';
  static const String stripeCreate     = '/api/stripe/create-order';
  static const String paystackCreate   = '/api/paystack/create-order';
  static const String flutterwaveCreate = '/api/flutterwave/webhook';
  static const String easepayCreate    = '/api/easepay/create-order';
  static const String easepayVerify    = '/api/easepay/verify-payment';
}
