import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../shared/widgets/error_view.dart';
import '../../../../shared/widgets/loading_shimmer.dart';
import '../../domain/entities/product.dart';
import '../controllers/catalog_controller.dart';

class ProductDetailScreen extends ConsumerStatefulWidget {
  final String slug;
  const ProductDetailScreen({super.key, required this.slug});

  @override
  ConsumerState<ProductDetailScreen> createState() =>
      _ProductDetailScreenState();
}

class _ProductDetailScreenState extends ConsumerState<ProductDetailScreen> {
  ProductVariant? _selectedVariant;
  int _imageIndex = 0;

  @override
  Widget build(BuildContext context) {
    final productAsync = ref.watch(productDetailProvider(widget.slug));

    return Scaffold(
      body: productAsync.when(
        loading: () => const _PdpShimmer(),
        error: (e, _) => ErrorView(message: e.toString()),
        data: (product) {
          _selectedVariant ??= product.variants.isNotEmpty
              ? product.variants.first
              : null;
          return _PdpBody(
            product: product,
            selectedVariant: _selectedVariant,
            imageIndex: _imageIndex,
            onVariantSelected: (v) => setState(() => _selectedVariant = v),
            onImageChanged: (i) => setState(() => _imageIndex = i),
          );
        },
      ),
    );
  }
}

class _PdpBody extends ConsumerWidget {
  final Product product;
  final ProductVariant? selectedVariant;
  final int imageIndex;
  final void Function(ProductVariant) onVariantSelected;
  final void Function(int) onImageChanged;

  const _PdpBody({
    required this.product,
    required this.selectedVariant,
    required this.imageIndex,
    required this.onVariantSelected,
    required this.onImageChanged,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final effectivePrice = selectedVariant?.price ?? product.basePrice;
    final originalPrice  = selectedVariant?.originalPrice ?? product.originalPrice;
    final inStock        = selectedVariant?.inStock ?? true;
    final images = product.imageUrls.isNotEmpty
        ? product.imageUrls
        : [product.thumbnailUrl ?? ''];

    return CustomScrollView(
      slivers: [
        // Image gallery + app bar
        SliverAppBar(
          expandedHeight: 320,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            background: Stack(
              children: [
                PageView.builder(
                  itemCount: images.length,
                  onPageChanged: onImageChanged,
                  itemBuilder: (_, i) => CachedNetworkImage(
                    imageUrl: images[i],
                    fit: BoxFit.contain,
                    placeholder: (_, __) => const ShimmerBox(height: 320),
                    errorWidget: (_, __, ___) =>
                        Container(color: AppColors.grey100),
                  ),
                ),
                if (images.length > 1)
                  Positioned(
                    bottom: 12,
                    left: 0,
                    right: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        images.length,
                        (i) => AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          margin: const EdgeInsets.symmetric(horizontal: 3),
                          width: imageIndex == i ? 16 : 6,
                          height: 6,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(3),
                            color: imageIndex == i
                                ? AppColors.primary
                                : AppColors.grey300,
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          actions: [
            IconButton(
              icon: Icon(
                product.inWishlist ? Icons.favorite : Icons.favorite_border,
                color: product.inWishlist ? AppColors.error : null,
              ),
              onPressed: () {/* toggle wishlist */},
            ),
            IconButton(
              icon: const Icon(Icons.share),
              onPressed: () {/* share product URL */},
            ),
          ],
        ),

        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Brand
                if (product.brandName != null)
                  Text(
                    product.brandName!.toUpperCase(),
                    style: theme.textTheme.labelSmall?.copyWith(
                        color: AppColors.primary, letterSpacing: 1),
                  ),
                const SizedBox(height: 4),

                // Name
                Text(product.name, style: theme.textTheme.headlineSmall),
                const SizedBox(height: 8),

                // Price row
                Row(
                  children: [
                    Text(
                      CurrencyFormatter.formatCompact(effectivePrice),
                      style: theme.textTheme.headlineMedium?.copyWith(
                          color: AppColors.priceDiscounted,
                          fontWeight: FontWeight.w700),
                    ),
                    if (originalPrice != null) ...[
                      const SizedBox(width: 8),
                      Text(
                        CurrencyFormatter.formatCompact(originalPrice),
                        style: theme.textTheme.bodyMedium?.copyWith(
                          decoration: TextDecoration.lineThrough,
                          color: AppColors.priceOriginal,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        CurrencyFormatter.discountPercent(
                            originalPrice, effectivePrice),
                        style: theme.textTheme.labelMedium
                            ?.copyWith(color: AppColors.success),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 4),

                // Rating
                if (product.rating != null)
                  Row(
                    children: [
                      const Icon(Icons.star, size: 16, color: AppColors.warning),
                      const SizedBox(width: 4),
                      Text(
                        '${product.rating!.toStringAsFixed(1)} (${product.reviewCount} reviews)',
                        style: theme.textTheme.bodySmall,
                      ),
                    ],
                  ),
                const SizedBox(height: 16),

                // Variants
                if (product.variants.length > 1) ...[
                  Text('Select Variant', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: product.variants.map((v) {
                      final selected = selectedVariant?.id == v.id;
                      return ChoiceChip(
                        label: Text(v.name),
                        selected: selected,
                        onSelected: (_) => onVariantSelected(v),
                        selectedColor: AppColors.primary.withValues(alpha: 38),
                        labelStyle: TextStyle(
                          color: selected ? AppColors.primary : AppColors.grey700,
                          fontWeight: selected
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),
                ],

                // Stock badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: inStock
                        ? AppColors.success.withValues(alpha: 26)
                        : AppColors.error.withValues(alpha: 26),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    inStock ? 'In Stock' : 'Out of Stock',
                    style: TextStyle(
                      color: inStock ? AppColors.success : AppColors.error,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Description
                if (product.description != null) ...[
                  Text('Description', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 8),
                  Text(product.description!, style: theme.textTheme.bodyMedium),
                  const SizedBox(height: 20),
                ],

                // Reviews link
                OutlinedButton.icon(
                  onPressed: () => context.push('/product/${product.slug}/reviews'),
                  icon: const Icon(Icons.rate_review_outlined),
                  label: Text('${product.reviewCount} Reviews'),
                ),
                const SizedBox(height: 80), // space for bottom bar
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ── Bottom add-to-cart bar ───────────────────────────────────────────────────
extension on _PdpBody {
  // Rendered via Scaffold bottomNavigationBar in the parent
}

// ── Shimmer ─────────────────────────────────────────────────────────────────
class _PdpShimmer extends StatelessWidget {
  const _PdpShimmer();

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        ShimmerBox(height: 320),
        SizedBox(height: 16),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ShimmerBox(height: 16, width: 80),
              SizedBox(height: 8),
              ShimmerBox(height: 24, width: 240),
              SizedBox(height: 12),
              ShimmerBox(height: 32, width: 120),
            ],
          ),
        ),
      ],
    );
  }
}
