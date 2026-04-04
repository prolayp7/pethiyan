import 'package:equatable/equatable.dart';

class ProductVariant extends Equatable {
  final String id;
  final String name;
  final double price;
  final double? originalPrice;
  final int stock;
  final Map<String, String> attributes; // e.g. {'Color': 'Red', 'Size': 'M'}

  const ProductVariant({
    required this.id,
    required this.name,
    required this.price,
    this.originalPrice,
    required this.stock,
    this.attributes = const {},
  });

  bool get inStock => stock > 0;
  bool get hasDiscount => originalPrice != null && originalPrice! > price;

  @override
  List<Object?> get props => [id, name, price, originalPrice, stock];
}

class Product extends Equatable {
  final String id;
  final String slug;
  final String name;
  final String? description;
  final String? thumbnailUrl;
  final List<String> imageUrls;
  final double basePrice;
  final double? originalPrice;
  final double? rating;
  final int reviewCount;
  final List<ProductVariant> variants;
  final String? categorySlug;
  final String? brandName;
  final bool inWishlist;

  const Product({
    required this.id,
    required this.slug,
    required this.name,
    this.description,
    this.thumbnailUrl,
    this.imageUrls = const [],
    required this.basePrice,
    this.originalPrice,
    this.rating,
    this.reviewCount = 0,
    this.variants = const [],
    this.categorySlug,
    this.brandName,
    this.inWishlist = false,
  });

  bool get hasDiscount => originalPrice != null && originalPrice! > basePrice;

  @override
  List<Object?> get props => [id, slug, name, basePrice];
}
