import 'package:equatable/equatable.dart';

class CartItem extends Equatable {
  final String id;
  final String productSlug;
  final String productName;
  final String? thumbnailUrl;
  final String? variantId;
  final String? variantName;
  final int quantity;
  final double price;
  final double? originalPrice;
  final int maxQuantity;
  final bool savedForLater;

  const CartItem({
    required this.id,
    required this.productSlug,
    required this.productName,
    this.thumbnailUrl,
    this.variantId,
    this.variantName,
    required this.quantity,
    required this.price,
    this.originalPrice,
    this.maxQuantity = 10,
    this.savedForLater = false,
  });

  double get subtotal => price * quantity;

  @override
  List<Object?> get props => [id, productSlug, variantId, quantity];
}

class Cart extends Equatable {
  final List<CartItem> items;
  final List<CartItem> savedItems;
  final double subtotal;
  final double discount;
  final double shippingCharge;
  final double total;

  const Cart({
    this.items = const [],
    this.savedItems = const [],
    this.subtotal = 0,
    this.discount = 0,
    this.shippingCharge = 0,
    this.total = 0,
  });

  int get itemCount => items.fold(0, (sum, i) => sum + i.quantity);

  @override
  List<Object?> get props => [items, savedItems, total];
}
