import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../shared/widgets/app_button.dart';
import '../controllers/checkout_controller.dart';
import 'payment_launcher.dart';

class CheckoutScreen extends ConsumerWidget {
  const CheckoutScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final checkout = ref.watch(checkoutProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: Column(
        children: [
          // Step indicator
          _StepIndicator(current: checkout.step),
          Expanded(
            child: switch (checkout.step) {
              CheckoutStep.address  => _AddressStep(),
              CheckoutStep.promo    => _PromoStep(),
              CheckoutStep.payment  => _PaymentStep(),
              CheckoutStep.review   => _ReviewStep(),
            },
          ),
          if (checkout.errorMessage != null)
            Container(
              color: AppColors.error.withValues(alpha: 26),
              padding: const EdgeInsets.all(12),
              child: Text(checkout.errorMessage!,
                  style: const TextStyle(color: AppColors.error)),
            ),
        ],
      ),
    );
  }
}

// ── Step indicator ─────────────────────────────────────────────────────────
class _StepIndicator extends StatelessWidget {
  final CheckoutStep current;
  const _StepIndicator({required this.current});

  @override
  Widget build(BuildContext context) {
    const steps = ['Address', 'Promo', 'Payment', 'Review'];
    final currentIdx = CheckoutStep.values.indexOf(current);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      child: Row(
        children: List.generate(steps.length * 2 - 1, (i) {
          if (i.isOdd) {
            return Expanded(
              child: Container(
                height: 2,
                color: i ~/ 2 < currentIdx ? AppColors.primary : AppColors.grey300,
              ),
            );
          }
          final stepIdx = i ~/ 2;
          final done    = stepIdx < currentIdx;
          final active  = stepIdx == currentIdx;
          return Column(
            children: [
              Container(
                width: 28, height: 28,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: done || active ? AppColors.primary : AppColors.grey200,
                ),
                child: Center(
                  child: done
                      ? const Icon(Icons.check, size: 16, color: Colors.white)
                      : Text('${stepIdx + 1}',
                          style: TextStyle(
                              color: active ? Colors.white : AppColors.grey500,
                              fontSize: 12, fontWeight: FontWeight.w600)),
                ),
              ),
              const SizedBox(height: 4),
              Text(steps[stepIdx],
                  style: TextStyle(
                      fontSize: 10,
                      color: active ? AppColors.primary : AppColors.grey700)),
            ],
          );
        }),
      ),
    );
  }
}

// ── Step: Address ──────────────────────────────────────────────────────────
class _AddressStep extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final addressesAsync = ref.watch(_addressesProvider);

    return addressesAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('$e')),
      data: (addresses) => ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ...addresses.map((addr) {
            final selected =
                ref.watch(checkoutProvider).selectedAddress == addr;
            return Card(
              child: ListTile(
                leading: Icon(
                  selected
                      ? Icons.radio_button_checked
                      : Icons.radio_button_unchecked,
                  color: selected ? AppColors.primary : AppColors.grey500,
                ),
                title: Text(addr['label'] as String? ?? 'Address'),
                subtitle: Text(
                  '${addr['address_line_1']}, ${addr['city']}, ${addr['state']} ${addr['pincode']}',
                ),
                onTap: () =>
                    ref.read(checkoutProvider.notifier).selectAddress(addr),
              ),
            );
          }),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () {/* navigate to add address */},
            icon: const Icon(Icons.add),
            label: const Text('Add New Address'),
          ),
        ],
      ),
    );
  }
}

final _addressesProvider =
    FutureProvider.autoDispose<List<Map<String, dynamic>>>((ref) async {
  final client = await ref.watch(dioClientProvider.future);
  final res = await client.get(ApiConstants.userAddresses);
  return (res.data['data'] as List? ?? []).cast<Map<String, dynamic>>();
});

// ── Step: Promo ────────────────────────────────────────────────────────────
class _PromoStep extends ConsumerStatefulWidget {
  @override
  ConsumerState<_PromoStep> createState() => _PromoStepState();
}

class _PromoStepState extends ConsumerState<_PromoStep> {
  final _ctrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final checkout = ref.watch(checkoutProvider);

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Have a promo code?',
              style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _ctrl,
                  textCapitalization: TextCapitalization.characters,
                  decoration: const InputDecoration(hintText: 'Enter promo code'),
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: checkout.isLoading
                    ? null
                    : () => ref
                        .read(checkoutProvider.notifier)
                        .applyPromo(_ctrl.text.trim()),
                child: const Text('Apply'),
              ),
            ],
          ),
          if (checkout.promoDiscount > 0)
            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: Text(
                'Promo applied! You save ${CurrencyFormatter.formatCompact(checkout.promoDiscount)}',
                style: const TextStyle(color: AppColors.success, fontWeight: FontWeight.w600),
              ),
            ),
          const Spacer(),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () =>
                      ref.read(checkoutProvider.notifier).skipPromo(),
                  child: const Text('Skip'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ── Step: Payment ──────────────────────────────────────────────────────────
class _PaymentStep extends ConsumerWidget {
  static const _methods = [
    {'key': 'razorpay',    'label': 'Razorpay',    'icon': Icons.credit_card},
    {'key': 'stripe',      'label': 'Stripe',      'icon': Icons.credit_card},
    {'key': 'paystack',    'label': 'Paystack',    'icon': Icons.payment},
    {'key': 'flutterwave', 'label': 'Flutterwave', 'icon': Icons.payment},
    {'key': 'wallet',      'label': 'Wallet',      'icon': Icons.account_balance_wallet},
    {'key': 'cod',         'label': 'Cash on Delivery', 'icon': Icons.money},
    {'key': 'easepay',     'label': 'Easepay',     'icon': Icons.payment},
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selected = ref.watch(checkoutProvider).selectedPaymentMethod;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: _methods.map((m) {
        final key = m['key'] as String;
        final isSelected = selected == key;
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: Icon(
              isSelected
                  ? Icons.radio_button_checked
                  : Icons.radio_button_unchecked,
              color: isSelected ? AppColors.primary : AppColors.grey500,
            ),
            title: Text(m['label'] as String),
            trailing: Icon(m['icon'] as IconData, color: AppColors.primary),
            onTap: () => ref.read(checkoutProvider.notifier).selectPayment(key),
          ),
        );
      }).toList(),
    );
  }
}

// ── Step: Review ───────────────────────────────────────────────────────────
class _ReviewStep extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final checkout = ref.watch(checkoutProvider);

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _ReviewRow('Delivery to', checkout.selectedAddress?['label'] ?? '-'),
          _ReviewRow('Payment', checkout.selectedPaymentMethod ?? '-'),
          if (checkout.promoCode != null)
            _ReviewRow('Promo', checkout.promoCode!),
          const Spacer(),
          AppButton(
            label: 'Place Order',
            isLoading: checkout.isLoading,
            onPressed: checkout.isLoading ? null : () async {
              if (checkout.selectedPaymentMethod == 'cod') {
                final slug = await ref.read(checkoutProvider.notifier).placeOrder();
                if (slug != null && context.mounted) {
                  ref.read(checkoutProvider.notifier).reset();
                  context.go('/order-confirmation/$slug');
                }
              } else {
                // Launch payment gateway
                await PaymentLauncher.launch(context, ref, checkout);
              }
            },
          ),
        ],
      ),
    );
  }
}

class _ReviewRow extends StatelessWidget {
  final String label;
  final String value;
  const _ReviewRow(this.label, this.value);
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 6),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.grey700)),
        Text(value,  style: const TextStyle(fontWeight: FontWeight.w600)),
      ],
    ),
  );
}
