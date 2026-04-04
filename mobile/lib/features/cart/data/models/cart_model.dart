import '../../domain/entities/cart_item.dart';

class CartItemModel extends CartItem {
  const CartItemModel({
    required super.id,
    required super.productSlug,
    required super.productName,
    super.thumbnailUrl,
    super.variantId,
    super.variantName,
    required super.quantity,
    required super.price,
    super.originalPrice,
    super.maxQuantity,
    super.savedForLater,
  });

  factory CartItemModel.fromJson(Map<String, dynamic> json) {
    final product  = json['product']  as Map<String, dynamic>? ?? {};
    final variant  = json['variant']  as Map<String, dynamic>?;
    final stockQty = variant?['stock'] as int? ?? product['stock'] as int? ?? 99;

    return CartItemModel(
      id:            json['id']?.toString() ?? '',
      productSlug:   product['slug'] as String? ?? '',
      productName:   product['name'] as String? ?? '',
      thumbnailUrl:  product['thumbnail_url'] as String?,
      variantId:     variant?['id']?.toString(),
      variantName:   variant?['name'] as String?,
      quantity:      json['quantity'] as int? ?? 1,
      price:         (json['price'] as num? ?? 0).toDouble(),
      originalPrice: json['original_price'] != null
          ? (json['original_price'] as num).toDouble()
          : null,
      maxQuantity:   stockQty,
      savedForLater: json['save_for_later'] as bool? ?? false,
    );
  }
}

class CartModel extends Cart {
  const CartModel({
    super.items,
    super.savedItems,
    super.subtotal,
    super.discount,
    super.shippingCharge,
    super.total,
  });

  factory CartModel.fromJson(Map<String, dynamic> json) {
    final data   = json['data'] as Map<String, dynamic>? ?? json;
    final rawItems = data['items'] as List? ?? [];
    final allItems = rawItems
        .map((e) => CartItemModel.fromJson(e as Map<String, dynamic>))
        .toList();

    return CartModel(
      items:         allItems.where((i) => !i.savedForLater).toList(),
      savedItems:    allItems.where((i) => i.savedForLater).toList(),
      subtotal:      (data['subtotal'] as num? ?? 0).toDouble(),
      discount:      (data['discount'] as num? ?? 0).toDouble(),
      shippingCharge:(data['shipping_charge'] as num? ?? 0).toDouble(),
      total:         (data['total'] as num? ?? 0).toDouble(),
    );
  }
}
