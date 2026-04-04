import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../shared/widgets/error_view.dart';
import '../../../../shared/widgets/loading_shimmer.dart';
import '../../../../shared/widgets/product_card.dart';
import '../controllers/catalog_controller.dart';

final _storeDetailProvider =
    FutureProvider.autoDispose.family<Map<String, dynamic>, String>(
  (ref, slug) async {
    final client = await ref.watch(dioClientProvider.future);
    final res = await client.get('${ApiConstants.stores}/$slug');
    return res.data['data'] as Map<String, dynamic>;
  },
);

class StoreScreen extends ConsumerWidget {
  final String slug;
  const StoreScreen({super.key, required this.slug});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storeAsync = ref.watch(_storeDetailProvider(slug));

    return Scaffold(
      body: storeAsync.when(
        loading: () => const _StoreShimmer(),
        error: (e, _) => ErrorView(message: e.toString()),
        data: (store) => CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 180,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                title: Text(store['name'] as String? ?? ''),
                background: store['cover_url'] != null
                    ? Image.network(store['cover_url'] as String, fit: BoxFit.cover)
                    : Container(color: AppColors.primary.withOpacity(0.1)),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (store['description'] != null)
                      Text(store['description'] as String,
                          style: Theme.of(context).textTheme.bodyMedium),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.star, size: 16, color: AppColors.warning),
                        const SizedBox(width: 4),
                        Text(
                          '${store['rating'] ?? 'N/A'} rating',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(16, 8, 16, 4),
                child: Text('Products',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              ),
            ),
            // Store products — reuse product list with store filter
            _StoreProductGrid(storeSlug: slug),
          ],
        ),
      ),
    );
  }
}

class _StoreProductGrid extends ConsumerWidget {
  final String storeSlug;
  const _StoreProductGrid({required this.storeSlug});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final params = ProductListParams(search: null); // TODO: add storeSlug filter when backend supports it
    final listAsync = ref.watch(productListProvider(params));

    return listAsync.when(
      loading: () => const SliverToBoxAdapter(child: ShimmerBox(height: 300)),
      error: (e, _) => SliverToBoxAdapter(child: ErrorView(message: e.toString())),
      data: (state) => SliverPadding(
        padding: const EdgeInsets.all(12),
        sliver: SliverGrid(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2, childAspectRatio: 0.68,
            crossAxisSpacing: 10, mainAxisSpacing: 10,
          ),
          delegate: SliverChildBuilderDelegate(
            (_, i) {
              final p = state.products[i];
              return ProductCard(
                name: p.name,
                thumbnailUrl: p.thumbnailUrl ?? '',
                price: p.basePrice,
                originalPrice: p.originalPrice,
                rating: p.rating,
                onTap: () => context.push('/product/${p.slug}'),
              );
            },
            childCount: state.products.length,
          ),
        ),
      ),
    );
  }
}

class _StoreShimmer extends StatelessWidget {
  const _StoreShimmer();
  @override
  Widget build(BuildContext context) => Column(children: const [
    ShimmerBox(height: 180),
    SizedBox(height: 16),
    Padding(padding: EdgeInsets.all(16), child: ShimmerBox(height: 60)),
  ]);
}
