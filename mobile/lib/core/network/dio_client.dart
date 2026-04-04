import 'package:dio/dio.dart';
import 'package:dio_cache_interceptor/dio_cache_interceptor.dart';
import 'package:dio_cache_interceptor_hive_store/dio_cache_interceptor_hive_store.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';

import '../constants/api_constants.dart';
import '../constants/app_constants.dart';
import '../storage/secure_storage.dart';
import 'auth_interceptor.dart';
import 'retry_interceptor.dart';

class DioClient {
  late final Dio _dio;
  late final CacheOptions _cacheOptions;

  DioClient._(this._dio, this._cacheOptions);

  static Future<DioClient> create(SecureStorage storage) async {
    final dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(seconds: AppConstants.connectTimeout),
        receiveTimeout: const Duration(seconds: AppConstants.receiveTimeout),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Platform': 'mobile',
          'X-App-Version': '1.0.0',
        },
      ),
    );

    // Setup cache store
    final cacheDir = await getTemporaryDirectory();
    final store = HiveCacheStore('${cacheDir.path}/dio_cache');
    final cacheOptions = CacheOptions(
      store: store,
      policy: CachePolicy.request,
      hitCacheOnErrorExcept: [401, 403],
      maxStale: const Duration(days: 1),
    );

    dio.interceptors.addAll([
      AuthInterceptor(storage),
      DioCacheInterceptor(options: cacheOptions),
      RetryInterceptor(dio: dio, retries: 2),
      if (kDebugMode)
        LogInterceptor(
          requestBody: true,
          responseBody: true,
          requestHeader: false,
          logPrint: (o) => debugPrint('[DIO] $o'),
        ),
    ]);

    return DioClient._(dio, cacheOptions);
  }

  Dio get dio => _dio;
  CacheOptions get cacheOptions => _cacheOptions;

  /// GET with optional cache TTL override
  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Duration? cacheTtl,
    bool forceRefresh = false,
  }) async {
    final options = cacheTtl != null
        ? _cacheOptions
            .copyWith(maxStale: Nullable(cacheTtl))
            .toOptions()
        : null;

    if (forceRefresh) {
      options?.extra.addAll(
        CacheOptions(
          store: _cacheOptions.store!,
          policy: CachePolicy.refresh,
        ).toOptions().extra,
      );
    }

    return _dio.get(path, queryParameters: queryParameters, options: options);
  }

  Future<Response> post(String path, {dynamic data}) =>
      _dio.post(path, data: data);

  Future<Response> put(String path, {dynamic data}) =>
      _dio.put(path, data: data);

  Future<Response> patch(String path, {dynamic data}) =>
      _dio.patch(path, data: data);

  Future<Response> delete(String path) => _dio.delete(path);
}

final dioClientProvider = FutureProvider<DioClient>((ref) async {
  final storage = ref.watch(secureStorageProvider);
  return DioClient.create(storage);
});
