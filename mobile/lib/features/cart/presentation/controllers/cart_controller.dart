import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/cart_model.dart';
import '../../domain/entities/cart_item.dart';

class CartController extends AsyncNotifier<Cart> {
  @override
  Future<Cart> build() async => _fetch();

  Future<Cart> _fetch() async {
    final client = await ref.watch(dioClientProvider.future);
    final res = await client.get(ApiConstants.cart);
    return CartModel.fromJson(res.data as Map<String, dynamic>);
  }

  Future<void> addItem({
    required String productId,
    required String variantId,
    int quantity = 1,
  }) async {
    final client = await ref.read(dioClientProvider.future);
    await client.post(ApiConstants.cartAdd, data: {
      'product_id': productId,
      'variant_id': variantId,
      'quantity':   quantity,
    });
    await refresh();
  }

  Future<void> updateItem(String cartItemId, int quantity) async {
    final client = await ref.read(dioClientProvider.future);
    await client.post('${ApiConstants.cart}/item/$cartItemId',
        data: {'quantity': quantity});
    await refresh();
  }

  Future<void> removeItem(String cartItemId) async {
    final client = await ref.read(dioClientProvider.future);
    await client.delete('${ApiConstants.cart}/item/$cartItemId');
    await refresh();
  }

  Future<void> saveForLater(String cartItemId) async {
    final client = await ref.read(dioClientProvider.future);
    await client.post(
        '${ApiConstants.cart}/item/save-for-later/$cartItemId');
    await refresh();
  }

  Future<void> clearCart() async {
    final client = await ref.read(dioClientProvider.future);
    await client.get(ApiConstants.cartClear);
    await refresh();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(_fetch);
  }
}

final cartProvider =
    AsyncNotifierProvider<CartController, Cart>(CartController.new);

// Badge count — derived from cart state
final cartCountProvider = Provider<int>((ref) {
  return ref.watch(cartProvider).valueOrNull?.itemCount ?? 0;
});
