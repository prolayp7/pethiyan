import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Must be a top-level function — called when app is terminated
@pragma('vm:entry-point')
Future<void> _firebaseBackgroundHandler(RemoteMessage message) async {
  debugPrint('[FCM] Background message: ${message.messageId}');
}

class FcmService {
  static final _messaging = FirebaseMessaging.instance;
  static final _localNotifications = FlutterLocalNotificationsPlugin();

  static const _androidChannel = AndroidNotificationChannel(
    'lcommerce_high_importance',
    'LCommerce Notifications',
    description: 'Order updates, promotions, and alerts.',
    importance: Importance.high,
  );

  static Future<void> initialize() async {
    // Register background handler
    FirebaseMessaging.onBackgroundMessage(_firebaseBackgroundHandler);

    // Request permission (iOS + Android 13+)
    await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // Create Android notification channel
    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(_androidChannel);

    // Init local notifications
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings();
    await _localNotifications.initialize(
      const InitializationSettings(android: androidSettings, iOS: iosSettings),
      onDidReceiveNotificationResponse: _onLocalNotificationTap,
    );

    // Foreground message display
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
  }

  static Future<String?> getToken() => _messaging.getToken();

  static Stream<String> get onTokenRefresh => _messaging.onTokenRefresh;

  /// Handles notification tap when app is in background (not terminated)
  static Stream<RemoteMessage> get onMessageOpenedApp =>
      FirebaseMessaging.onMessageOpenedApp;

  /// Returns the message that launched the app from terminated state
  static Future<RemoteMessage?> getInitialMessage() =>
      _messaging.getInitialMessage();

  static void _handleForegroundMessage(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;

    _localNotifications.show(
      notification.hashCode,
      notification.title,
      notification.body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          _androidChannel.id,
          _androidChannel.name,
          channelDescription: _androidChannel.description,
          icon: '@mipmap/ic_launcher',
        ),
        iOS: const DarwinNotificationDetails(),
      ),
      payload: _encodePayload(message.data),
    );
  }

  static void _onLocalNotificationTap(NotificationResponse response) {
    // Payload routing is handled by the router listener
    debugPrint('[FCM] Local notification tapped: ${response.payload}');
  }

  static String _encodePayload(Map<String, dynamic> data) {
    return data.entries.map((e) => '${e.key}=${e.value}').join('&');
  }

  /// Parse FCM data payload to determine deep-link route
  static String? routeFromPayload(Map<String, dynamic> data) {
    final type = data['type'] as String?;
    switch (type) {
      case 'order_status':
        return '/order/${data['order_slug']}';
      case 'wallet':
        return '/wallet';
      case 'promo':
        return '/home';
      case 'support_ticket':
        return '/support';
      default:
        return '/notifications';
    }
  }
}
