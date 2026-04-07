import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../shared/widgets/error_view.dart';
import '../../../../shared/widgets/loading_shimmer.dart';
import '../../../../shared/widgets/product_card.dart';
import '../controllers/catalog_controller.dart';

class CategoryScreen extends ConsumerStatefulWidget {
  const CategoryScreen({super.key});

  @override
  ConsumerState<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends ConsumerState<CategoryScreen> {
  final _scrollController = ScrollController();
  late final ProductListParams _params;

  @override
  void initState() {
    super.initState();
    _params = const ProductListParams();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(productListProvider(_params).notifier).loadMore();
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final listAsync = ref.watch(productListProvider(_params));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => context.push('/search'),
          ),
        ],
      ),
      body: listAsync.when(
        loading: () => const _ProductGridShimmer(),
        error: (e, _) => ErrorView(message: e.toString()),
        data: (state) => GridView.builder(
          controller: _scrollController,
          padding: const EdgeInsets.all(12),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.68,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
          ),
          itemCount: state.products.length + (state.hasMore ? 2 : 0),
          itemBuilder: (_, i) {
            if (i >= state.products.length) return const ShimmerBox(height: 220, borderRadius: 12);
            final product = state.products[i];
            return ProductCard(
              name:          product.name,
              thumbnailUrl:  product.thumbnailUrl ?? '',
              price:         product.basePrice,
              originalPrice: product.originalPrice,
              rating:        product.rating,
              onTap: () => context.push('/product/${product.slug}'),
            );
          },
        ),
      ),
    );
  }
}

class _ProductGridShimmer extends StatelessWidget {
  const _ProductGridShimmer();

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2, childAspectRatio: 0.68,
        crossAxisSpacing: 10, mainAxisSpacing: 10,
      ),
      itemCount: 6,
      itemBuilder: (_, __) => const ShimmerBox(height: 220, borderRadius: 12),
    );
  }
}
