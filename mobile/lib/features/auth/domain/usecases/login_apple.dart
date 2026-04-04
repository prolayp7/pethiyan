import 'package:dartz/dartz.dart';

import '../../../../core/errors/failures.dart';
import '../repositories/auth_repository.dart';

class LoginWithApple {
  final AuthRepository _repository;
  const LoginWithApple(this._repository);

  Future<Either<Failure, String>> call(String identityToken) =>
      _repository.loginWithApple(identityToken);
}
