import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';

class WishlistItem {
  final String id;
  final String productId;
  final String productName;
  final String? thumbnailUrl;
  final double price;
  final String? variantId;
  const WishlistItem({
    required this.id,
    required this.productId,
    required this.productName,
    this.thumbnailUrl,
    required this.price,
    this.variantId,
  });

  factory WishlistItem.fromJson(Map<String, dynamic> json) {
    final product = json['product'] as Map<String, dynamic>? ?? {};
    return WishlistItem(
      id:           json['id']?.toString() ?? '',
      productId:    product['id']?.toString() ?? '',
      productName:  product['name'] as String? ?? '',
      thumbnailUrl: product['thumbnail_url'] as String?,
      price:        (product['price'] as num? ?? 0).toDouble(),
      variantId:    json['variant_id']?.toString(),
    );
  }
}

class WishlistState {
  final List<Map<String, dynamic>> lists;   // [{id, title, item_count}]
  final List<WishlistItem> activeItems;
  final String? activeListId;
  const WishlistState({
    this.lists = const [],
    this.activeItems = const [],
    this.activeListId,
  });
}

class WishlistController extends AsyncNotifier<WishlistState> {
  @override
  Future<WishlistState> build() async => _fetchLists();

  Future<WishlistState> _fetchLists() async {
    final client = await ref.watch(dioClientProvider.future);
    final res = await client.get(ApiConstants.wishlists);
    final lists = (res.data['data'] as List? ?? [])
        .cast<Map<String, dynamic>>();
    return WishlistState(lists: lists);
  }

  Future<void> loadItems(String wishlistId) async {
    final client = await ref.read(dioClientProvider.future);
    final res = await client.get('${ApiConstants.wishlists}/$wishlistId');
    final items = (res.data['data']?['items'] as List? ?? [])
        .map((e) => WishlistItem.fromJson(e as Map<String, dynamic>))
        .toList();
    state = AsyncData(WishlistState(
      lists:        state.valueOrNull?.lists ?? [],
      activeItems:  items,
      activeListId: wishlistId,
    ));
  }

  Future<void> addItem({
    required String productId,
    required String wishlistId,
    String? variantId,
  }) async {
    final client = await ref.read(dioClientProvider.future);
    await client.post(ApiConstants.wishlists, data: {
      'product_id':  productId,
      'wishlist_id': wishlistId,
      if (variantId != null) 'variant_id': variantId,
    });
    if (state.valueOrNull?.activeListId == wishlistId) {
      await loadItems(wishlistId);
    }
  }

  Future<void> removeItem(String itemId) async {
    final client = await ref.read(dioClientProvider.future);
    await client.delete('${ApiConstants.wishlists}/items/$itemId');
    state = AsyncData(WishlistState(
      lists:       state.valueOrNull?.lists ?? [],
      activeItems: state.valueOrNull?.activeItems
              .where((i) => i.id != itemId)
              .toList() ??
          [],
      activeListId: state.valueOrNull?.activeListId,
    ));
  }

  Future<void> createList(String title) async {
    final client = await ref.read(dioClientProvider.future);
    await client.post('${ApiConstants.wishlists}/create', data: {'title': title});
    state = const AsyncLoading();
    state = await AsyncValue.guard(_fetchLists);
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(_fetchLists);
  }
}

final wishlistProvider =
    AsyncNotifierProvider<WishlistController, WishlistState>(
        WishlistController.new);
