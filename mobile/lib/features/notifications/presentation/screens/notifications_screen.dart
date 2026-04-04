import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/services/fcm_service.dart';
import '../../../../core/utils/date_formatter.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() =>
      _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    // Listen for notification taps while screen is open
    FcmService.onMessageOpenedApp.listen((message) {
      final route = FcmService.routeFromPayload(message.data);
      if (route != null && mounted) context.push(route);
    });
  }

  @override
  Widget build(BuildContext context) {
    // In a full implementation, notifications are fetched from
    // the backend /api/user/notifications endpoint and stored in Hive.
    // Here we show the structural scaffold.
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          TextButton(
            onPressed: () {/* mark all read */},
            child: const Text('Mark all read'),
          ),
        ],
      ),
      body: const _NotificationList(),
    );
  }
}

class _NotificationList extends StatelessWidget {
  const _NotificationList();

  // Placeholder data — replace with provider-driven list
  static const _sample = [
    {
      'title':    'Order Confirmed',
      'body':     'Your order #ORD-001 has been confirmed.',
      'type':     'order_status',
      'order_slug': 'ORD-001',
      'read':     false,
      'time':     '2026-04-04T10:00:00Z',
    },
    {
      'title':    'Delivery Update',
      'body':     'Your order is out for delivery!',
      'type':     'order_status',
      'order_slug': 'ORD-001',
      'read':     true,
      'time':     '2026-04-04T08:00:00Z',
    },
  ];

  @override
  Widget build(BuildContext context) {
    if (_sample.isEmpty) {
      return const Center(child: Text('No notifications yet.'));
    }
    return ListView.separated(
      itemCount: _sample.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (_, i) {
        final n    = _sample[i];
        final read = n['read'] as bool;
        return ListTile(
          tileColor: read ? null : AppColors.primary.withOpacity(0.04),
          leading: CircleAvatar(
            backgroundColor: AppColors.primary.withOpacity(0.1),
            child: const Icon(Icons.notifications, color: AppColors.primary, size: 20),
          ),
          title: Text(n['title'] as String,
              style: TextStyle(
                  fontWeight: read ? FontWeight.normal : FontWeight.w600)),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(n['body'] as String,
                  maxLines: 2, overflow: TextOverflow.ellipsis),
              Text(DateFormatter.timeAgo(n['time'] as String),
                  style: const TextStyle(fontSize: 11, color: AppColors.grey500)),
            ],
          ),
          onTap: () {
            final route = FcmService.routeFromPayload(
                {'type': n['type'], 'order_slug': n['order_slug']});
            if (route != null) context.push(route);
          },
        );
      },
    );
  }
}
