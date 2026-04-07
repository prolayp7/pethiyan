import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/services/fcm_service.dart';
import '../../../../core/storage/local_storage.dart';
import '../../../../core/storage/secure_storage.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/remote_auth_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final RemoteAuthDatasource _remote;
  final SecureStorage _secureStorage;
  final NetworkInfo _networkInfo;

  AuthRepositoryImpl(this._remote, this._secureStorage, this._networkInfo);

  @override
  Future<Either<Failure, void>> sendOtp(String phone) =>
      _run(() => _remote.sendOtp(phone));

  @override
  Future<Either<Failure, String>> verifyOtp(String phone, String otp) =>
      _run(() async {
        final token = await _remote.verifyOtp(phone, otp);
        await _postLoginSetup(token);
        return token;
      });

  @override
  Future<Either<Failure, void>> resendOtp(String phone) =>
      _run(() => _remote.resendOtp(phone));

  @override
  Future<Either<Failure, String>> loginWithEmail(String email, String password) =>
      _run(() async {
        final token = await _remote.loginWithEmail(email, password);
        await _postLoginSetup(token);
        return token;
      });

  @override
  Future<Either<Failure, String>> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) =>
      _run(() async {
        final token = await _remote.register(
          name: name, email: email, phone: phone, password: password,
        );
        await _postLoginSetup(token);
        return token;
      });

  @override
  Future<Either<Failure, String>> loginWithGoogle(String idToken) =>
      _run(() async {
        final token = await _remote.loginWithGoogle(idToken);
        await _postLoginSetup(token);
        return token;
      });

  @override
  Future<Either<Failure, String>> loginWithApple(String identityToken) =>
      _run(() async {
        final token = await _remote.loginWithApple(identityToken);
        await _postLoginSetup(token);
        return token;
      });

  @override
  Future<Either<Failure, void>> logout() =>
      _run(() async {
        await _remote.logout();
        await _secureStorage.clearAll();
        await LocalStorage.clearAll();
      });

  @override
  Future<Either<Failure, User>> getProfile() =>
      _run(() async {
        final user = await _remote.getProfile();
        await LocalStorage.saveUserProfile(user.toJson());
        return user;
      });

  @override
  Future<Either<Failure, void>> forgotPassword(String email) =>
      _run(() => _remote.forgotPassword(email));

  // --- Helpers ---

  Future<void> _postLoginSetup(String token) async {
    await _secureStorage.saveToken(token);
    // Register FCM token with backend
    final fcmToken = await FcmService.getToken();
    if (fcmToken != null) {
      await _secureStorage.saveFcmToken(fcmToken);
      // FCM token registration to backend happens in the caller after profile fetch
    }
  }

  Future<Either<Failure, T>> _run<T>(Future<T> Function() action) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      return Right(await action());
    } on ValidationException catch (e) {
      return Left(ValidationFailure(e.allErrors, e.fieldErrors));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message, statusCode: e.statusCode));
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) return const Left(AuthFailure('Session expired.'));
      if (e.response?.statusCode == 422) {
        final data = e.response?.data as Map<String, dynamic>?;
        final errors = data?['errors'] as Map<String, dynamic>?;
        if (errors != null) {
          final typed = errors.map((k, v) => MapEntry(k, List<String>.from(v as List)));
          return Left(ValidationFailure(data?['message'] as String? ?? 'Validation failed.', typed));
        }
      }
      return Left(ServerFailure(e.message ?? 'Server error.', statusCode: e.response?.statusCode));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }
}
