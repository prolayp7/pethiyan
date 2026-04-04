class StorageKeys {
  StorageKeys._();

  // SecureStorage keys (encrypted)
  static const String authToken       = 'auth_token';
  static const String fcmToken        = 'fcm_token';
  static const String userId          = 'user_id';

  // Hive box names
  static const String userBox         = 'user_box';
  static const String cartBox         = 'cart_box';          // guest cart
  static const String settingsBox     = 'settings_box';
  static const String cacheBox        = 'cache_box';
  static const String searchBox       = 'search_box';        // recent searches

  // Hive keys
  static const String userProfile     = 'user_profile';
  static const String deliveryZoneId  = 'delivery_zone_id';
  static const String deliveryPincode = 'delivery_pincode';
  static const String onboardingDone  = 'onboarding_done';
  static const String appCurrency     = 'app_currency';
  static const String recentSearches  = 'recent_searches';
}
