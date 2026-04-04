import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';

enum CheckoutStep { address, promo, payment, review }

class CheckoutState {
  final CheckoutStep step;
  final Map<String, dynamic>? selectedAddress;
  final String? promoCode;
  final double promoDiscount;
  final String? selectedPaymentMethod; // razorpay | stripe | paystack | flutterwave | wallet | cod | easepay
  final bool isLoading;
  final String? errorMessage;

  const CheckoutState({
    this.step = CheckoutStep.address,
    this.selectedAddress,
    this.promoCode,
    this.promoDiscount = 0,
    this.selectedPaymentMethod,
    this.isLoading = false,
    this.errorMessage,
  });

  CheckoutState copyWith({
    CheckoutStep? step,
    Map<String, dynamic>? selectedAddress,
    String? promoCode,
    double? promoDiscount,
    String? selectedPaymentMethod,
    bool? isLoading,
    String? errorMessage,
  }) =>
      CheckoutState(
        step:                  step                  ?? this.step,
        selectedAddress:       selectedAddress       ?? this.selectedAddress,
        promoCode:             promoCode             ?? this.promoCode,
        promoDiscount:         promoDiscount         ?? this.promoDiscount,
        selectedPaymentMethod: selectedPaymentMethod ?? this.selectedPaymentMethod,
        isLoading:             isLoading             ?? this.isLoading,
        errorMessage:          errorMessage,
      );
}

class CheckoutController extends Notifier<CheckoutState> {
  @override
  CheckoutState build() => const CheckoutState();

  void selectAddress(Map<String, dynamic> address) {
    state = state.copyWith(
      selectedAddress: address,
      step: CheckoutStep.promo,
    );
  }

  Future<bool> applyPromo(String code) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final client = await ref.read(dioClientProvider.future);
      final res = await client.get(
        ApiConstants.promosValidate,
        queryParameters: {'code': code},
      );
      final discount = (res.data['data']?['discount_amount'] as num? ?? 0).toDouble();
      state = state.copyWith(
        isLoading:    false,
        promoCode:    code,
        promoDiscount: discount,
        step:         CheckoutStep.payment,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading:    false,
        errorMessage: 'Invalid or expired promo code.',
      );
      return false;
    }
  }

  void skipPromo() {
    state = state.copyWith(step: CheckoutStep.payment);
  }

  void selectPayment(String method) {
    state = state.copyWith(
      selectedPaymentMethod: method,
      step: CheckoutStep.review,
    );
  }

  void goToStep(CheckoutStep step) {
    state = state.copyWith(step: step);
  }

  Future<String?> placeOrder() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final client = await ref.read(dioClientProvider.future);
      final res = await client.post(ApiConstants.orders, data: {
        'address_id':      state.selectedAddress!['id'],
        'payment_method':  state.selectedPaymentMethod,
        if (state.promoCode != null) 'promo_code': state.promoCode,
      });
      state = state.copyWith(isLoading: false);
      return res.data['data']?['slug'] as String?;
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
      return null;
    }
  }

  void reset() => state = const CheckoutState();
}

final checkoutProvider =
    NotifierProvider<CheckoutController, CheckoutState>(CheckoutController.new);
