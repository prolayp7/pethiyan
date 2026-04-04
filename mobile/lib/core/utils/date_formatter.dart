import 'package:intl/intl.dart';

class DateFormatter {
  static String orderDate(String isoDate) {
    final dt = DateTime.tryParse(isoDate);
    if (dt == null) return isoDate;
    return DateFormat('dd MMM yyyy, hh:mm a').format(dt.toLocal());
  }

  static String shortDate(String isoDate) {
    final dt = DateTime.tryParse(isoDate);
    if (dt == null) return isoDate;
    return DateFormat('dd MMM yyyy').format(dt.toLocal());
  }

  static String timeAgo(String isoDate) {
    final dt = DateTime.tryParse(isoDate);
    if (dt == null) return isoDate;
    final diff = DateTime.now().difference(dt.toLocal());

    if (diff.inSeconds < 60) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return shortDate(isoDate);
  }
}
