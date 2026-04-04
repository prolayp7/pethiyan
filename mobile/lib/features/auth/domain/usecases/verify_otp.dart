import 'package:dartz/dartz.dart';

import '../../../../core/errors/failures.dart';
import '../repositories/auth_repository.dart';

class VerifyOtp {
  final AuthRepository _repository;
  const VerifyOtp(this._repository);

  Future<Either<Failure, String>> call(String phone, String otp) =>
      _repository.verifyOtp(phone, otp);
}
