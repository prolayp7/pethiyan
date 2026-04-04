import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../app/theme/app_colors.dart';
import '../../core/utils/currency_formatter.dart';
import 'loading_shimmer.dart';

class ProductCard extends StatelessWidget {
  final String name;
  final String thumbnailUrl;
  final double price;
  final double? originalPrice;
  final double? rating;
  final VoidCallback onTap;
  final VoidCallback? onWishlistTap;
  final bool inWishlist;

  const ProductCard({
    super.key,
    required this.name,
    required this.thumbnailUrl,
    required this.price,
    this.originalPrice,
    this.rating,
    required this.onTap,
    this.onWishlistTap,
    this.inWishlist = false,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Expanded(
              child: Stack(
                children: [
                  CachedNetworkImage(
                    imageUrl: thumbnailUrl,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    memCacheWidth: AppConstants.thumbnailCacheWidth,
                    placeholder: (_, __) => const ShimmerBox(),
                    errorWidget: (_, __, ___) =>
                        Container(color: AppColors.grey100,
                            child: const Icon(Icons.image_outlined,
                                color: AppColors.grey300, size: 36)),
                  ),
                  // Discount badge
                  if (originalPrice != null && originalPrice! > price)
                    Positioned(
                      top: 6, left: 6,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.error,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          CurrencyFormatter.discountPercent(originalPrice!, price),
                          style: const TextStyle(
                              color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                  // Wishlist button
                  if (onWishlistTap != null)
                    Positioned(
                      top: 4, right: 4,
                      child: GestureDetector(
                        onTap: onWishlistTap,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: const BoxDecoration(
                              color: Colors.white, shape: BoxShape.circle),
                          child: Icon(
                            inWishlist ? Icons.favorite : Icons.favorite_border,
                            size: 16,
                            color: inWishlist ? AppColors.error : AppColors.grey500,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),

            // Info
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                  const SizedBox(height: 4),

                  // Price row
                  Row(
                    children: [
                      Text(
                        CurrencyFormatter.formatCompact(price),
                        style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 13,
                            color: AppColors.priceDiscounted),
                      ),
                      if (originalPrice != null && originalPrice! > price) ...[
                        const SizedBox(width: 4),
                        Text(
                          CurrencyFormatter.formatCompact(originalPrice!),
                          style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.priceOriginal,
                              decoration: TextDecoration.lineThrough),
                        ),
                      ],
                    ],
                  ),

                  // Rating
                  if (rating != null) ...[
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Icon(Icons.star, size: 12, color: AppColors.warning),
                        const SizedBox(width: 2),
                        Text(rating!.toStringAsFixed(1),
                            style: const TextStyle(fontSize: 11, color: AppColors.grey700)),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Import constant needed
class AppConstants {
  static const int thumbnailCacheWidth = 300;
}
