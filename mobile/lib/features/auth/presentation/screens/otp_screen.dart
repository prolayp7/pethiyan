import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sms_autofill/sms_autofill.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/errors/failures.dart';
import '../../../../shared/widgets/app_button.dart';
import '../controllers/auth_controller.dart';

class OtpScreen extends ConsumerStatefulWidget {
  final String phone;
  const OtpScreen({super.key, required this.phone});

  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen> with CodeAutoFill {
  final _otpController = TextEditingController();
  int _secondsLeft = AppConstants.otpResendCooldown;
  int _resendAttempts = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    listenForCode();
    _startTimer();
  }

  @override
  void codeUpdated() {
    if (code != null && code!.length == AppConstants.otpLength) {
      _otpController.text = code!;
      _verifyOtp();
    }
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() => _secondsLeft = AppConstants.otpResendCooldown);
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsLeft == 0) {
        t.cancel();
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  Future<void> _verifyOtp() async {
    final otp = _otpController.text.trim();
    if (otp.length != AppConstants.otpLength) return;

    final success = await ref
        .read(authControllerProvider.notifier)
        .verifyOtp(widget.phone, otp);

    if (success && mounted) {
      context.go('/home');
    } else if (mounted) {
      final state = ref.read(authControllerProvider);
      if (state.hasError) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text((state.error as Failure).message),
          backgroundColor: AppColors.error,
        ));
      }
    }
  }

  Future<void> _resendOtp() async {
    if (_resendAttempts >= AppConstants.otpMaxResendAttempts) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Maximum resend attempts reached. Please try again later.'),
      ));
      return;
    }
    await ref.read(authControllerProvider.notifier).sendOtp(widget.phone);
    _resendAttempts++;
    _startTimer();
  }

  @override
  void dispose() {
    cancel();
    _otpController.dispose();
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = ref.watch(authControllerProvider).isLoading;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Verify OTP')),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('OTP sent to', style: theme.textTheme.bodyLarge?.copyWith(color: AppColors.grey700)),
            const SizedBox(height: 4),
            Text('+91 ${widget.phone}', style: theme.textTheme.titleLarge),
            const SizedBox(height: 32),

            PinFieldAutoFill(
              controller: _otpController,
              codeLength: AppConstants.otpLength,
              decoration: UnderlineDecoration(
                colorBuilder: FixedColorBuilder(AppColors.primary),
                textStyle: theme.textTheme.headlineMedium!,
              ),
              onCodeChanged: (v) {
                if (v != null && v.length == AppConstants.otpLength) _verifyOtp();
              },
            ),
            const SizedBox(height: 32),

            AppButton(
              label: 'Verify',
              onPressed: isLoading ? null : _verifyOtp,
              isLoading: isLoading,
            ),
            const SizedBox(height: 24),

            Center(
              child: _secondsLeft > 0
                  ? Text(
                      'Resend OTP in ${_secondsLeft}s',
                      style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.grey500),
                    )
                  : TextButton(
                      onPressed: isLoading ? null : _resendOtp,
                      child: const Text('Resend OTP'),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
