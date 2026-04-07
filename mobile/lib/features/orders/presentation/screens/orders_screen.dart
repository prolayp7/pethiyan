import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../../../shared/widgets/error_view.dart';
import '../../../../shared/widgets/loading_shimmer.dart';
import '../controllers/orders_controller.dart';

class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(ordersProvider);

    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('My Orders'),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'All'),
              Tab(text: 'Active'),
              Tab(text: 'Completed'),
              Tab(text: 'Cancelled'),
            ],
          ),
        ),
        body: ordersAsync.when(
          loading: () => const _OrdersShimmer(),
          error: (e, _) => ErrorView(
            message: e.toString(),
            onRetry: () => ref.read(ordersProvider.notifier).refresh(),
          ),
          data: (orders) => TabBarView(
            children: [
              _OrderList(orders: orders),
              _OrderList(orders: orders.where((o) => _isActive(o.status)).toList()),
              _OrderList(orders: orders.where((o) => o.status == 'delivered').toList()),
              _OrderList(orders: orders.where((o) => o.status == 'cancelled').toList()),
            ],
          ),
        ),
      ),
    );
  }

  bool _isActive(String s) =>
      ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery'].contains(s);
}

class _OrderList extends StatelessWidget {
  final List<Order> orders;
  const _OrderList({required this.orders});

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return const Center(child: Text('No orders found.'));
    }
    return RefreshIndicator(
      onRefresh: () => Future.value(),
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: orders.length,
        itemBuilder: (_, i) => _OrderCard(order: orders[i]),
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final Order order;
  const _OrderCard({required this.order});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => context.push('/order/${order.slug}'),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Order #${order.slug}',
                      style: const TextStyle(fontWeight: FontWeight.w600)),
                  _StatusBadge(status: order.status),
                ],
              ),
              const SizedBox(height: 4),
              Text(DateFormatter.shortDate(order.createdAt),
                  style: const TextStyle(fontSize: 12, color: AppColors.grey700)),
              const SizedBox(height: 8),
              Text('${order.items.length} item(s) · ${CurrencyFormatter.formatCompact(order.total)}',
                  style: const TextStyle(fontWeight: FontWeight.w500)),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (_isTrackable(order.status))
                    TextButton(
                      onPressed: () => context.push('/track/${order.slug}'),
                      child: const Text('Track'),
                    ),
                  TextButton(
                    onPressed: () => context.push('/order/${order.slug}'),
                    child: const Text('Details'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  bool _isTrackable(String s) =>
      ['shipped', 'out_for_delivery'].contains(s);
}

class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge({required this.status});

  Color get _color => switch (status) {
    'pending'          => AppColors.statusPending,
    'confirmed'        => AppColors.statusConfirmed,
    'processing'       => AppColors.statusConfirmed,
    'shipped'          => AppColors.statusShipped,
    'out_for_delivery' => AppColors.statusShipped,
    'delivered'        => AppColors.statusDelivered,
    'cancelled'        => AppColors.statusCancelled,
    'returned'         => AppColors.statusReturned,
    _                  => AppColors.grey500,
  };

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
    decoration: BoxDecoration(
      color: _color.withValues(alpha: 31),
      borderRadius: BorderRadius.circular(20),
    ),
    child: Text(
      status.replaceAll('_', ' ').toUpperCase(),
      style: TextStyle(color: _color, fontSize: 10, fontWeight: FontWeight.w700),
    ),
  );
}

class _OrdersShimmer extends StatelessWidget {
  const _OrdersShimmer();
  @override
  Widget build(BuildContext context) => ListView.builder(
    padding: const EdgeInsets.all(12),
    itemCount: 4,
    itemBuilder: (_, __) => const Padding(
      padding: EdgeInsets.only(bottom: 10),
      child: ShimmerBox(height: 110, borderRadius: 12),
    ),
  );
}
