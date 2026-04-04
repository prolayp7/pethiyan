import 'package:dartz/dartz.dart';

import '../../../../core/errors/failures.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, void>>   sendOtp(String phone);
  Future<Either<Failure, String>> verifyOtp(String phone, String otp);
  Future<Either<Failure, void>>   resendOtp(String phone);
  Future<Either<Failure, String>> loginWithEmail(String email, String password);
  Future<Either<Failure, String>> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  });
  Future<Either<Failure, String>> loginWithGoogle(String idToken);
  Future<Either<Failure, String>> loginWithApple(String identityToken);
  Future<Either<Failure, void>>   logout();
  Future<Either<Failure, User>>   getProfile();
  Future<Either<Failure, void>>   forgotPassword(String email);
}
