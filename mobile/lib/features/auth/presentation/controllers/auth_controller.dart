import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

import '../../../../core/errors/failures.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../providers/auth_providers.dart';

// Global auth state — null = not logged in
final currentUserProvider = StateProvider<User?>((ref) => null);

class AuthController extends AsyncNotifier<void> {
  late AuthRepository _repo;

  @override
  Future<void> build() async {
    final repoAsync = ref.watch(authRepositoryProvider);
    _repo = await repoAsync.future;
  }

  Future<void> sendOtp(String phone) async {
    state = const AsyncLoading();
    final result = await _repo.sendOtp(phone);
    state = result.fold(
      (failure) => AsyncError(failure, StackTrace.current),
      (_) => const AsyncData(null),
    );
  }

  Future<bool> verifyOtp(String phone, String otp) async {
    state = const AsyncLoading();
    final result = await _repo.verifyOtp(phone, otp);
    return result.fold(
      (failure) {
        state = AsyncError(failure, StackTrace.current);
        return false;
      },
      (_) {
        state = const AsyncData(null);
        _loadProfile();
        return true;
      },
    );
  }

  Future<bool> loginWithGoogle() async {
    state = const AsyncLoading();
    try {
      final googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) {
        state = const AsyncData(null);
        return false;
      }
      final auth = await googleUser.authentication;
      final idToken = auth.idToken;
      if (idToken == null) throw Exception('Google idToken is null');

      final result = await _repo.loginWithGoogle(idToken);
      return result.fold(
        (failure) {
          state = AsyncError(failure, StackTrace.current);
          return false;
        },
        (_) {
          state = const AsyncData(null);
          _loadProfile();
          return true;
        },
      );
    } catch (e, st) {
      state = AsyncError(UnexpectedFailure(e.toString()), st);
      return false;
    }
  }

  Future<bool> loginWithApple() async {
    state = const AsyncLoading();
    try {
      final credential = await SignInWithApple.getAppleIDCredential(
        scopes: [AppleIDAuthorizationScopes.email, AppleIDAuthorizationScopes.fullName],
      );
      final identityToken = credential.identityToken;
      if (identityToken == null) throw Exception('Apple identityToken is null');

      final result = await _repo.loginWithApple(identityToken);
      return result.fold(
        (failure) {
          state = AsyncError(failure, StackTrace.current);
          return false;
        },
        (_) {
          state = const AsyncData(null);
          _loadProfile();
          return true;
        },
      );
    } catch (e, st) {
      state = AsyncError(UnexpectedFailure(e.toString()), st);
      return false;
    }
  }

  Future<void> logout() async {
    state = const AsyncLoading();
    await _repo.logout();
    ref.read(currentUserProvider.notifier).state = null;
    state = const AsyncData(null);
  }

  Future<void> _loadProfile() async {
    final result = await _repo.getProfile();
    result.fold(
      (_) {},
      (user) => ref.read(currentUserProvider.notifier).state = user,
    );
  }
}

final authControllerProvider =
    AsyncNotifierProvider<AuthController, void>(AuthController.new);
