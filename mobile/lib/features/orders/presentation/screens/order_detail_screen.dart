import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../../../shared/widgets/error_view.dart';
import '../../../../shared/widgets/loading_shimmer.dart';
import '../controllers/orders_controller.dart';

class OrderDetailScreen extends ConsumerWidget {
  final String orderSlug;
  const OrderDetailScreen({super.key, required this.orderSlug});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orderAsync = ref.watch(orderDetailProvider(orderSlug));

    return Scaffold(
      appBar: AppBar(title: Text('Order #$orderSlug')),
      body: orderAsync.when(
        loading: () => const _DetailShimmer(),
        error: (e, _) => ErrorView(message: e.toString()),
        data: (order) => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Status card
            _InfoCard(children: [
              _Row('Status',  order.status.replaceAll('_', ' ').toUpperCase()),
              _Row('Date',    DateFormatter.orderDate(order.createdAt)),
              _Row('Payment', order.paymentMethod ?? '-'),
              _Row('Total',   CurrencyFormatter.formatCompact(order.total)),
            ]),
            const SizedBox(height: 12),

            // Timeline
            if (order.timeline.isNotEmpty) ...[
              const Text('Order Timeline', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
              const SizedBox(height: 8),
              ...order.timeline.map((t) => _TimelineItem(
                label: t['status'] as String? ?? '',
                date:  t['created_at'] as String? ?? '',
              )),
              const SizedBox(height: 12),
            ],

            // Delivery address
            if (order.address != null) ...[
              const Text('Delivery Address', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
              const SizedBox(height: 8),
              _InfoCard(children: [
                Text('${order.address!['address_line_1']}\n'
                    '${order.address!['city']}, ${order.address!['state']} ${order.address!['pincode']}'),
              ]),
              const SizedBox(height: 12),
            ],

            // Items
            const Text('Items', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
            const SizedBox(height: 8),
            ...order.items.map((item) => _OrderItemTile(item: item, orderSlug: orderSlug)),
            const SizedBox(height: 16),

            // Actions
            Row(
              children: [
                if (order.invoiceUrl != null)
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => launchUrl(Uri.parse(order.invoiceUrl!)),
                      icon: const Icon(Icons.receipt_long),
                      label: const Text('Invoice'),
                    ),
                  ),
                const SizedBox(width: 8),
                if (order.status == 'shipped' || order.status == 'out_for_delivery')
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => context.push('/track/$orderSlug'),
                      icon: const Icon(Icons.location_on),
                      label: const Text('Track'),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _OrderItemTile extends ConsumerWidget {
  final OrderItem item;
  final String orderSlug;
  const _OrderItemTile({required this.item, required this.orderSlug});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CachedNetworkImage(
          imageUrl: item.thumbnailUrl ?? '',
          width: 50, height: 50, fit: BoxFit.cover,
          errorWidget: (_, __, ___) =>
              Container(width: 50, height: 50, color: AppColors.grey200),
        ),
        title: Text(item.productName, maxLines: 2, overflow: TextOverflow.ellipsis),
        subtitle: Text(
          '${item.variantName != null ? '${item.variantName} · ' : ''}Qty: ${item.quantity}'),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(CurrencyFormatter.formatCompact(item.price),
                style: const TextStyle(fontWeight: FontWeight.w600)),
            if (item.status == 'delivered')
              TextButton(
                style: TextButton.styleFrom(
                    minimumSize: Size.zero, padding: EdgeInsets.zero),
                onPressed: () {/* cancel */},
                child: const Text('Return',
                    style: TextStyle(fontSize: 11, color: AppColors.error)),
              )
            else if (item.status == 'pending')
              TextButton(
                style: TextButton.styleFrom(
                    minimumSize: Size.zero, padding: EdgeInsets.zero),
                onPressed: () {/* return */},
                child: const Text('Cancel',
                    style: TextStyle(fontSize: 11, color: AppColors.error)),
              ),
          ],
        ),
      ),
    );
  }
}

class _TimelineItem extends StatelessWidget {
  final String label;
  final String date;
  const _TimelineItem({required this.label, required this.date});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: Row(
      children: [
        const Icon(Icons.circle, size: 10, color: AppColors.primary),
        const SizedBox(width: 8),
        Expanded(child: Text(label.replaceAll('_', ' ').toUpperCase(),
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500))),
        Text(DateFormatter.timeAgo(date),
            style: const TextStyle(fontSize: 11, color: AppColors.grey500)),
      ],
    ),
  );
}

class _InfoCard extends StatelessWidget {
  final List<Widget> children;
  const _InfoCard({required this.children});
  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: children,
      ),
    ),
  );
}

class _Row extends StatelessWidget {
  final String label;
  final String value;
  const _Row(this.label, this.value);
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 3),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.grey700)),
        Text(value,  style: const TextStyle(fontWeight: FontWeight.w500)),
      ],
    ),
  );
}

class _DetailShimmer extends StatelessWidget {
  const _DetailShimmer();
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(16),
    child: Column(children: const [
      ShimmerBox(height: 120, borderRadius: 12),
      SizedBox(height: 12),
      ShimmerBox(height: 80,  borderRadius: 12),
      SizedBox(height: 12),
      ShimmerBox(height: 200, borderRadius: 12),
    ]),
  );
}
