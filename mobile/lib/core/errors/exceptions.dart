class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final Map<String, dynamic>? errors;

  const ApiException({
    required this.message,
    this.statusCode,
    this.errors,
  });

  @override
  String toString() => 'ApiException($statusCode): $message';
}

class NetworkException implements Exception {
  final String message;
  const NetworkException({this.message = 'No internet connection.'});

  @override
  String toString() => 'NetworkException: $message';
}

class AuthException implements Exception {
  final String message;
  const AuthException({required this.message});

  @override
  String toString() => 'AuthException: $message';
}

class CacheException implements Exception {
  final String message;
  const CacheException({required this.message});

  @override
  String toString() => 'CacheException: $message';
}

class ValidationException implements Exception {
  final Map<String, List<String>> fieldErrors;

  const ValidationException(this.fieldErrors);

  String? firstError(String field) => fieldErrors[field]?.first;

  String get allErrors =>
      fieldErrors.entries.map((e) => '${e.key}: ${e.value.join(', ')}').join('\n');

  @override
  String toString() => 'ValidationException: $allErrors';
}
