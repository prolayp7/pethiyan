import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/utils/validators.dart';
import '../../../../shared/widgets/app_button.dart';
import '../controllers/auth_controller.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    if (!_formKey.currentState!.validate()) return;
    final phone = _phoneController.text.trim();
    await ref.read(authControllerProvider.notifier).sendOtp(phone);
    final state = ref.read(authControllerProvider);
    if (state.hasError) {
      _showError(state.error as Failure);
      return;
    }
    if (mounted) context.push('/otp?phone=${Uri.encodeComponent(phone)}');
  }

  Future<void> _googleLogin() async {
    final success = await ref.read(authControllerProvider.notifier).loginWithGoogle();
    if (success && mounted) context.go('/home');
    else if (!success && mounted) {
      final state = ref.read(authControllerProvider);
      if (state.hasError) _showError(state.error as Failure);
    }
  }

  Future<void> _appleLogin() async {
    final success = await ref.read(authControllerProvider.notifier).loginWithApple();
    if (success && mounted) context.go('/home');
    else if (!success && mounted) {
      final state = ref.read(authControllerProvider);
      if (state.hasError) _showError(state.error as Failure);
    }
  }

  void _showError(Failure failure) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(failure.message), backgroundColor: AppColors.error),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState.isLoading;
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),
              Text('Welcome back', style: theme.textTheme.displaySmall),
              const SizedBox(height: 8),
              Text('Login with your mobile number', style: theme.textTheme.bodyLarge?.copyWith(color: AppColors.grey700)),
              const SizedBox(height: 40),

              Form(
                key: _formKey,
                child: TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  autofillHints: const [AutofillHints.telephoneNumber],
                  decoration: const InputDecoration(
                    labelText: 'Mobile Number',
                    hintText: '10-digit mobile number',
                    prefixText: '+91 ',
                  ),
                  validator: Validators.phone,
                ),
              ),
              const SizedBox(height: 24),

              AppButton(
                label: 'Send OTP',
                onPressed: isLoading ? null : _sendOtp,
                isLoading: isLoading,
              ),
              const SizedBox(height: 16),

              OutlinedButton(
                onPressed: () => context.push('/register'),
                child: const Text('Create Account'),
              ),

              const SizedBox(height: 32),
              const _Divider(label: 'OR'),
              const SizedBox(height: 24),

              // Google
              _SocialButton(
                label: 'Continue with Google',
                icon: Icons.g_mobiledata_rounded,
                onPressed: isLoading ? null : _googleLogin,
              ),
              const SizedBox(height: 12),

              // Apple (always show, required for iOS)
              _SocialButton(
                label: 'Continue with Apple',
                icon: Icons.apple_rounded,
                onPressed: isLoading ? null : _appleLogin,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  final String label;
  const _Divider({required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Expanded(child: Divider()),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(label, style: Theme.of(context).textTheme.bodySmall),
        ),
        const Expanded(child: Divider()),
      ],
    );
  }
}

class _SocialButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback? onPressed;

  const _SocialButton({required this.label, required this.icon, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon),
      label: Text(label),
      style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(52)),
    );
  }
}
