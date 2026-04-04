import 'package:dartz/dartz.dart';

import '../../../../core/errors/failures.dart';
import '../repositories/auth_repository.dart';

class LoginWithGoogle {
  final AuthRepository _repository;
  const LoginWithGoogle(this._repository);

  Future<Either<Failure, String>> call(String idToken) =>
      _repository.loginWithGoogle(idToken);
}
