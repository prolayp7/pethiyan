import '../../../../core/constants/api_constants.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/network/dio_client.dart';
import '../models/user_model.dart';

class RemoteAuthDatasource {
  final DioClient _client;
  RemoteAuthDatasource(this._client);

  Future<void> sendOtp(String phone) async {
    final res = await _client.post(ApiConstants.sendOtp, data: {'phone': phone});
    _assertSuccess(res.data);
  }

  Future<String> verifyOtp(String phone, String otp) async {
    final res = await _client.post(
      ApiConstants.verifyOtp,
      data: {'phone': phone, 'otp': otp},
    );
    _assertSuccess(res.data);
    return res.data['data']['token'] as String;
  }

  Future<void> resendOtp(String phone) async {
    final res = await _client.post(ApiConstants.resendOtp, data: {'phone': phone});
    _assertSuccess(res.data);
  }

  Future<String> loginWithEmail(String email, String password) async {
    final res = await _client.post(
      ApiConstants.login,
      data: {'email': email, 'password': password},
    );
    _assertSuccess(res.data);
    return res.data['data']['token'] as String;
  }

  Future<String> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    final res = await _client.post(ApiConstants.register, data: {
      'name': name,
      'email': email,
      'phone': phone,
      'password': password,
      'password_confirmation': password,
    });
    _assertSuccess(res.data);
    return res.data['data']['token'] as String;
  }

  Future<String> loginWithGoogle(String idToken) async {
    final res = await _client.post(
      ApiConstants.googleCallback,
      data: {'token': idToken},
    );
    _assertSuccess(res.data);
    return res.data['data']['token'] as String;
  }

  Future<String> loginWithApple(String identityToken) async {
    final res = await _client.post(
      ApiConstants.appleCallback,
      data: {'identity_token': identityToken},
    );
    _assertSuccess(res.data);
    return res.data['data']['token'] as String;
  }

  Future<void> logout() async {
    await _client.post(ApiConstants.logout);
  }

  Future<UserModel> getProfile() async {
    final res = await _client.get(ApiConstants.userProfile);
    return UserModel.fromJson(res.data['data'] as Map<String, dynamic>);
  }

  Future<void> forgotPassword(String email) async {
    final res = await _client.post(ApiConstants.forgotPassword, data: {'email': email});
    _assertSuccess(res.data);
  }

  void _assertSuccess(dynamic data) {
    final map = data as Map<String, dynamic>;
    final success = map['success'] as bool? ?? (map['status'] == 'success');
    if (!success) {
      final errors = map['errors'] as Map<String, dynamic>?;
      if (errors != null) {
        throw ValidationException(
          errors.map((k, v) => MapEntry(k, List<String>.from(v as List))),
        );
      }
      throw ApiException(message: map['message'] as String? ?? 'Request failed.');
    }
  }
}
