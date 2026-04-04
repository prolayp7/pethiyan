import 'package:intl/intl.dart';

class CurrencyFormatter {
  static String format(
    num amount, {
    String symbol = '₹',
    String locale = 'en_IN',
    int decimalDigits = 2,
  }) {
    final formatter = NumberFormat.currency(
      locale: locale,
      symbol: symbol,
      decimalDigits: decimalDigits,
    );
    return formatter.format(amount);
  }

  /// Format as integer when .00 (e.g. ₹499 instead of ₹499.00)
  static String formatCompact(num amount, {String symbol = '₹'}) {
    if (amount == amount.toInt()) {
      return '$symbol${amount.toInt()}';
    }
    return format(amount, symbol: symbol);
  }

  /// Returns discount percentage string e.g. "20% off"
  static String discountPercent(num original, num discounted) {
    if (original <= 0) return '';
    final pct = ((original - discounted) / original * 100).round();
    return '$pct% off';
  }

  /// Convert amount to paise (for Razorpay)
  static int toPaise(num amount) => (amount * 100).round();
}
