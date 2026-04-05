import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/api_constants.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/banner_model.dart';
import '../../domain/entities/banner_entity.dart';

class HomeData {
  final List<BannerEntity> banners;
  final List<Map<String, dynamic>> featuredSections;
  final List<Map<String, dynamic>> categories;

  const HomeData({
    required this.banners,
    required this.featuredSections,
    required this.categories,
  });
}

class HomeController extends AsyncNotifier<HomeData> {
  @override
  Future<HomeData> build() async {
    return _fetchAll();
  }

  Future<HomeData> _fetchAll() async {
    final client = await ref.watch(dioClientProvider.future);

    final results = await Future.wait([
      client.get(
        ApiConstants.banners,
        cacheTtl: const Duration(seconds: AppConstants.cacheBanners),
      ),
      client.get(
        '${ApiConstants.featuredSections}/all',
        cacheTtl: const Duration(seconds: AppConstants.cacheCategories),
      ),
      client.get(
        ApiConstants.categories,
        cacheTtl: const Duration(seconds: AppConstants.cacheCategories),
      ),
    ]);

    final banners = (results[0].data['data'] as List? ?? [])
        .map((e) => BannerModel.fromJson(e as Map<String, dynamic>))
        .toList();

    final featured = (results[1].data['data'] as List? ?? [])
        .cast<Map<String, dynamic>>();

    final categories = (results[2].data['data'] as List? ?? [])
        .cast<Map<String, dynamic>>();

    return HomeData(
      banners: banners,
      featuredSections: featured,
      categories: categories,
    );
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(_fetchAll);
  }
}

final homeControllerProvider =
    AsyncNotifierProvider<HomeController, HomeData>(HomeController.new);
