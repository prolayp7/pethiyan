import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/error_view.dart';
import '../../../../shared/widgets/loading_shimmer.dart';
import '../../domain/entities/cart_item.dart';
import '../controllers/cart_controller.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartAsync = ref.watch(cartProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Cart'),
        actions: [
          cartAsync.valueOrNull?.items.isNotEmpty == true
              ? TextButton(
                  onPressed: () =>
                      ref.read(cartProvider.notifier).clearCart(),
                  child: const Text('Clear', style: TextStyle(color: AppColors.error)),
                )
              : const SizedBox.shrink(),
        ],
      ),
      body: cartAsync.when(
        loading: () => const _CartShimmer(),
        error: (e, _) => ErrorView(
          message: e.toString(),
          onRetry: () => ref.read(cartProvider.notifier).refresh(),
        ),
        data: (cart) {
          if (cart.items.isEmpty) return const _EmptyCart();
          return Column(
            children: [
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(12),
                  children: [
                    ...cart.items.map((item) => _CartItemTile(item: item)),
                    if (cart.savedItems.isNotEmpty) ...[
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        child: Text('Saved for Later',
                            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                      ),
                      ...cart.savedItems.map((item) => _CartItemTile(item: item, isSaved: true)),
                    ],
                  ],
                ),
              ),
              _CartSummary(cart: cart),
            ],
          );
        },
      ),
    );
  }
}

// ── Cart item tile ────────────────────────────────────────────────────────────
class _CartItemTile extends ConsumerWidget {
  final CartItem item;
  final bool isSaved;
  const _CartItemTile({required this.item, this.isSaved = false});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ctrl = ref.read(cartProvider.notifier);

    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: CachedNetworkImage(
                imageUrl: item.thumbnailUrl ?? '',
                width: 72, height: 72, fit: BoxFit.cover,
                errorWidget: (_, __, ___) =>
                    Container(width: 72, height: 72, color: AppColors.grey200),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.productName,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.w500)),
                  if (item.variantName != null)
                    Text(item.variantName!,
                        style: const TextStyle(fontSize: 12, color: AppColors.grey700)),
                  const SizedBox(height: 6),
                  Text(CurrencyFormatter.formatCompact(item.price),
                      style: const TextStyle(
                          fontWeight: FontWeight.w700, color: AppColors.priceDiscounted)),
                ],
              ),
            ),
            Column(
              children: [
                if (!isSaved) _QuantityStepper(
                  quantity: item.quantity,
                  max: item.maxQuantity,
                  onDecrease: () => item.quantity > 1
                      ? ctrl.updateItem(item.id, item.quantity - 1)
                      : ctrl.removeItem(item.id),
                  onIncrease: () => ctrl.updateItem(item.id, item.quantity + 1),
                ),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () => isSaved
                      ? null // move back to cart
                      : ctrl.saveForLater(item.id),
                  child: Text(
                    isSaved ? 'Move to Cart' : 'Save',
                    style: const TextStyle(fontSize: 12, color: AppColors.primary),
                  ),
                ),
                GestureDetector(
                  onTap: () => ctrl.removeItem(item.id),
                  child: const Text('Remove',
                      style: TextStyle(fontSize: 12, color: AppColors.error)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ── Quantity stepper ─────────────────────────────────────────────────────────
class _QuantityStepper extends StatelessWidget {
  final int quantity;
  final int max;
  final VoidCallback onDecrease;
  final VoidCallback onIncrease;

  const _QuantityStepper({
    required this.quantity,
    required this.max,
    required this.onDecrease,
    required this.onIncrease,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _StepBtn(icon: Icons.remove, onTap: onDecrease),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Text('$quantity',
              style: const TextStyle(fontWeight: FontWeight.w600)),
        ),
        _StepBtn(
          icon: Icons.add,
          onTap: quantity < max ? onIncrease : null,
        ),
      ],
    );
  }
}

class _StepBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onTap;
  const _StepBtn({required this.icon, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 28, height: 28,
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.grey300),
          borderRadius: BorderRadius.circular(6),
          color: onTap == null ? AppColors.grey100 : Colors.white,
        ),
        child: Icon(icon, size: 16,
            color: onTap == null ? AppColors.grey300 : AppColors.grey900),
      ),
    );
  }
}

// ── Cart summary ─────────────────────────────────────────────────────────────
class _CartSummary extends StatelessWidget {
  final cart;
  const _CartSummary({required this.cart});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, -2))],
      ),
      child: Column(
        children: [
          _SummaryRow('Subtotal', CurrencyFormatter.formatCompact(cart.subtotal)),
          if (cart.discount > 0)
            _SummaryRow('Discount', '- ${CurrencyFormatter.formatCompact(cart.discount)}',
                valueColor: AppColors.success),
          _SummaryRow('Shipping', cart.shippingCharge > 0
              ? CurrencyFormatter.formatCompact(cart.shippingCharge)
              : 'FREE', valueColor: AppColors.success),
          const Divider(height: 16),
          _SummaryRow('Total', CurrencyFormatter.formatCompact(cart.total),
              bold: true),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: () => context.push('/checkout'),
            child: Text('Proceed to Checkout (${CurrencyFormatter.formatCompact(cart.total)})'),
          ),
        ],
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;
  final bool bold;
  const _SummaryRow(this.label, this.value, {this.valueColor, this.bold = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontWeight: bold ? FontWeight.w700 : FontWeight.normal)),
          Text(value, style: TextStyle(
              fontWeight: bold ? FontWeight.w700 : FontWeight.normal,
              color: valueColor)),
        ],
      ),
    );
  }
}

class _EmptyCart extends StatelessWidget {
  const _EmptyCart();
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.shopping_cart_outlined, size: 80, color: AppColors.grey300),
          const SizedBox(height: 16),
          const Text('Your cart is empty', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          const Text('Add items to get started', style: TextStyle(color: AppColors.grey700)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => context.go('/home'),
            child: const Text('Shop Now'),
          ),
        ],
      ),
    );
  }
}

class _CartShimmer extends StatelessWidget {
  const _CartShimmer();
  @override
  Widget build(BuildContext context) => ListView.builder(
    padding: const EdgeInsets.all(12),
    itemCount: 3,
    itemBuilder: (_, __) => const Padding(
      padding: EdgeInsets.only(bottom: 10),
      child: ShimmerBox(height: 100, borderRadius: 12),
    ),
  );
}
