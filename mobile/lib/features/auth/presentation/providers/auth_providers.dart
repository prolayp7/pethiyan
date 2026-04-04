import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/dio_client.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/storage/secure_storage.dart';
import '../../data/datasources/remote_auth_datasource.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/repositories/auth_repository.dart';

final authRepositoryProvider = FutureProvider<AuthRepository>((ref) async {
  final client = await ref.watch(dioClientProvider.future);
  final storage = ref.watch(secureStorageProvider);
  final network = ref.watch(networkInfoProvider);
  return AuthRepositoryImpl(
    RemoteAuthDatasource(client),
    storage,
    network,
  );
});
