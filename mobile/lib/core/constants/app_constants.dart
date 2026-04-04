class AppConstants {
  AppConstants._();

  // Pagination
  static const int defaultPageSize     = 20;

  // Timeouts (seconds)
  static const int connectTimeout      = 15;
  static const int receiveTimeout      = 30;

  // OTP
  static const int otpLength           = 6;
  static const int otpResendCooldown   = 60;   // seconds
  static const int otpMaxResendAttempts = 3;

  // Search debounce
  static const int searchDebounceMs    = 300;

  // Delivery tracking poll interval
  static const int trackingPollSeconds = 10;

  // Payment polling (after gateway callback)
  static const int paymentPollMaxAttempts = 6;
  static const int paymentPollIntervalSec = 5;

  // Cache TTL (seconds)
  static const int cacheBanners        = 300;    // 5 min
  static const int cacheCategories     = 1800;   // 30 min
  static const int cacheProductList    = 120;    // 2 min
  static const int cacheProductDetail  = 60;     // 1 min

  // Cart
  static const int cartMaxQuantity     = 10;
  static const int cartMaxItems        = 50;

  // Image
  static const int thumbnailCacheWidth = 300;
  static const int fullImageCacheWidth = 800;

  // Recent searches
  static const int maxRecentSearches   = 10;
}
