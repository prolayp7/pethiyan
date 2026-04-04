import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_constants.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/product_model.dart';
import '../../domain/entities/product.dart';

// ── Product listing state ────────────────────────────────────────────────────
class ProductListState {
  final List<Product> products;
  final bool hasMore;
  final int currentPage;
  const ProductListState({
    this.products = const [],
    this.hasMore = true,
    this.currentPage = 1,
  });

  ProductListState copyWith({
    List<Product>? products,
    bool? hasMore,
    int? currentPage,
  }) =>
      ProductListState(
        products:    products    ?? this.products,
        hasMore:     hasMore     ?? this.hasMore,
        currentPage: currentPage ?? this.currentPage,
      );
}

class ProductListParams {
  final String? categorySlug;
  final String? brandSlug;
  final String? search;
  final String? sortBy;   // price_asc | price_desc | rating | newest
  final double? minPrice;
  final double? maxPrice;

  const ProductListParams({
    this.categorySlug,
    this.brandSlug,
    this.search,
    this.sortBy,
    this.minPrice,
    this.maxPrice,
  });
}

class ProductListController
    extends AutoDisposeFamilyAsyncNotifier<ProductListState, ProductListParams> {
  @override
  Future<ProductListState> build(ProductListParams arg) async {
    return _fetchPage(1, arg);
  }

  Future<void> loadMore() async {
    final current = state.valueOrNull;
    if (current == null || !current.hasMore) return;
    final next = await _fetchPage(current.currentPage + 1, arg);
    state = AsyncData(current.copyWith(
      products:    [...current.products, ...next.products],
      hasMore:     next.hasMore,
      currentPage: next.currentPage,
    ));
  }

  Future<ProductListState> _fetchPage(int page, ProductListParams params) async {
    final client = await ref.watch(dioClientProvider.future);
    final query = <String, dynamic>{
      'page': page,
      'per_page': AppConstants.defaultPageSize,
      if (params.categorySlug != null) 'category': params.categorySlug,
      if (params.brandSlug != null)    'brand': params.brandSlug,
      if (params.search != null)       'keyword': params.search,
      if (params.sortBy != null)       'sort': params.sortBy,
      if (params.minPrice != null)     'min_price': params.minPrice,
      if (params.maxPrice != null)     'max_price': params.maxPrice,
    };

    final endpoint = params.search != null
        ? ApiConstants.productSearch
        : ApiConstants.products;

    final res = await client.get(
      endpoint,
      queryParameters: query,
      cacheTtl: const Duration(seconds: AppConstants.cacheProductList),
    );

    final items = (res.data['data'] as List? ?? [])
        .map((e) => ProductModel.fromJson(e as Map<String, dynamic>))
        .toList();

    final meta = res.data['meta'] as Map<String, dynamic>?;
    final lastPage = meta?['last_page'] as int? ?? 1;

    return ProductListState(
      products:    items,
      hasMore:     page < lastPage,
      currentPage: page,
    );
  }
}

final productListProvider = AsyncNotifierProviderFamily<
    ProductListController, ProductListState, ProductListParams>(
  ProductListController.new,
);

// ── Product detail ───────────────────────────────────────────────────────────
final productDetailProvider =
    FutureProvider.autoDispose.family<Product, String>((ref, slug) async {
  final client = await ref.watch(dioClientProvider.future);
  final res = await client.get(
    '${ApiConstants.products}/$slug',
    cacheTtl: const Duration(seconds: AppConstants.cacheProductDetail),
  );
  return ProductModel.fromJson(res.data['data'] as Map<String, dynamic>);
});
