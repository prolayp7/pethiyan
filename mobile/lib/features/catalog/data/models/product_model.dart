import '../../domain/entities/product.dart';

class ProductVariantModel extends ProductVariant {
  const ProductVariantModel({
    required super.id,
    required super.name,
    required super.price,
    super.originalPrice,
    required super.stock,
    super.attributes,
  });

  factory ProductVariantModel.fromJson(Map<String, dynamic> json) {
    final attrs = <String, String>{};
    final rawAttrs = json['attributes'] as List?;
    if (rawAttrs != null) {
      for (final a in rawAttrs) {
        final map = a as Map<String, dynamic>;
        attrs[map['attribute_name'] as String? ?? ''] =
            map['value'] as String? ?? '';
      }
    }
    return ProductVariantModel(
      id:            json['id']?.toString() ?? '',
      name:          json['name'] as String? ?? '',
      price:         (json['price'] as num? ?? 0).toDouble(),
      originalPrice: json['original_price'] != null
          ? (json['original_price'] as num).toDouble()
          : null,
      stock:         json['stock'] as int? ?? 0,
      attributes:    attrs,
    );
  }
}

class ProductModel extends Product {
  const ProductModel({
    required super.id,
    required super.slug,
    required super.name,
    super.description,
    super.thumbnailUrl,
    super.imageUrls,
    required super.basePrice,
    super.originalPrice,
    super.rating,
    super.reviewCount,
    super.variants,
    super.categorySlug,
    super.brandName,
    super.inWishlist,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    final images = (json['images'] as List? ?? [])
        .map((e) => e is Map ? e['url'] as String? ?? '' : e.toString())
        .where((u) => u.isNotEmpty)
        .toList();

    final variants = (json['variants'] as List? ?? [])
        .map((v) => ProductVariantModel.fromJson(v as Map<String, dynamic>))
        .toList();

    return ProductModel(
      id:            json['id']?.toString() ?? '',
      slug:          json['slug'] as String? ?? '',
      name:          json['name'] as String? ?? '',
      description:   json['description'] as String?,
      thumbnailUrl:  json['thumbnail_url'] as String? ?? json['image'] as String?,
      imageUrls:     images,
      basePrice:     (json['price'] as num? ?? 0).toDouble(),
      originalPrice: json['original_price'] != null
          ? (json['original_price'] as num).toDouble()
          : null,
      rating:        json['rating'] != null
          ? (json['rating'] as num).toDouble()
          : null,
      reviewCount:   json['reviews_count'] as int? ?? 0,
      variants:      variants,
      categorySlug:  json['category']?['slug'] as String?,
      brandName:     json['brand']?['name'] as String?,
      inWishlist:    json['in_wishlist'] as bool? ?? false,
    );
  }
}
