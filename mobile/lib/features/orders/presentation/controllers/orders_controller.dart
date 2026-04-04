import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_constants.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/network/dio_client.dart';

class OrderItem {
  final String id;
  final String productName;
  final String? thumbnailUrl;
  final String? variantName;
  final int quantity;
  final double price;
  final String status;

  const OrderItem({
    required this.id,
    required this.productName,
    this.thumbnailUrl,
    this.variantName,
    required this.quantity,
    required this.price,
    required this.status,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) => OrderItem(
    id:           json['id']?.toString() ?? '',
    productName:  json['product']?['name'] as String? ?? '',
    thumbnailUrl: json['product']?['thumbnail_url'] as String?,
    variantName:  json['variant']?['name'] as String?,
    quantity:     json['quantity'] as int? ?? 1,
    price:        (json['price'] as num? ?? 0).toDouble(),
    status:       json['status'] as String? ?? 'pending',
  );
}

class Order {
  final String id;
  final String slug;
  final String status;
  final double total;
  final String createdAt;
  final List<OrderItem> items;
  final Map<String, dynamic>? address;
  final String? paymentMethod;
  final String? invoiceUrl;
  final List<Map<String, dynamic>> timeline;

  const Order({
    required this.id,
    required this.slug,
    required this.status,
    required this.total,
    required this.createdAt,
    this.items = const [],
    this.address,
    this.paymentMethod,
    this.invoiceUrl,
    this.timeline = const [],
  });

  factory Order.fromJson(Map<String, dynamic> json) => Order(
    id:            json['id']?.toString() ?? '',
    slug:          json['slug'] as String? ?? '',
    status:        json['status'] as String? ?? 'pending',
    total:         (json['total'] as num? ?? 0).toDouble(),
    createdAt:     json['created_at'] as String? ?? '',
    items:         (json['items'] as List? ?? [])
        .map((e) => OrderItem.fromJson(e as Map<String, dynamic>))
        .toList(),
    address:       json['address'] as Map<String, dynamic>?,
    paymentMethod: json['payment_method'] as String?,
    invoiceUrl:    json['invoice_url'] as String?,
    timeline:      (json['timeline'] as List? ?? []).cast<Map<String, dynamic>>(),
  );
}

// ── Order list ─────────────────────────────────────────────────────────────
class OrdersController extends AsyncNotifier<List<Order>> {
  @override
  Future<List<Order>> build() async => _fetch();

  Future<List<Order>> _fetch() async {
    final client = await ref.watch(dioClientProvider.future);
    final res = await client.get(ApiConstants.orders,
        queryParameters: {'per_page': AppConstants.defaultPageSize});
    return (res.data['data'] as List? ?? [])
        .map((e) => Order.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(_fetch);
  }
}

final ordersProvider =
    AsyncNotifierProvider<OrdersController, List<Order>>(OrdersController.new);

// ── Order detail ───────────────────────────────────────────────────────────
final orderDetailProvider =
    FutureProvider.autoDispose.family<Order, String>((ref, slug) async {
  final client = await ref.watch(dioClientProvider.future);
  final res = await client.get('${ApiConstants.orders}/$slug',
      forceRefresh: true);
  return Order.fromJson(res.data['data'] as Map<String, dynamic>);
});
