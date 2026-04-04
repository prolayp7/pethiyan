import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../shared/widgets/loading_shimmer.dart';
import '../../../../shared/widgets/error_view.dart';
import '../controllers/home_controller.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final homeAsync = ref.watch(homeControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('LCommerce'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => context.push('/search'),
          ),
          IconButton(
            icon: const Icon(Icons.favorite_border),
            onPressed: () => context.push('/wishlist'),
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => context.push('/notifications'),
          ),
        ],
      ),
      body: homeAsync.when(
        loading: () => const _HomeShimmer(),
        error: (e, _) => ErrorView(
          message: e.toString(),
          onRetry: () => ref.read(homeControllerProvider.notifier).refresh(),
        ),
        data: (data) => RefreshIndicator(
          onRefresh: () => ref.read(homeControllerProvider.notifier).refresh(),
          child: CustomScrollView(
            slivers: [
              // Delivery zone bar
              const SliverToBoxAdapter(child: _DeliveryZoneBar()),

              // Banner carousel
              if (data.banners.isNotEmpty)
                SliverToBoxAdapter(
                  child: _BannerCarousel(banners: data.banners
                      .map((b) => b.imageUrl)
                      .toList()),
                ),

              // Categories
              if (data.categories.isNotEmpty) ...[
                _SectionHeader(
                  title: 'Categories',
                  onSeeAll: () => context.push('/categories'),
                ),
                SliverToBoxAdapter(
                  child: _CategoryRow(categories: data.categories),
                ),
              ],

              // Featured sections
              for (final section in data.featuredSections) ...[
                _SectionHeader(
                  title: section['name'] as String? ?? '',
                  onSeeAll: () => context.push(
                    '/categories?section=${section['slug']}',
                  ),
                ),
                SliverToBoxAdapter(
                  child: _FeaturedProductRow(
                    sectionSlug: section['slug'] as String? ?? '',
                  ),
                ),
              ],

              const SliverToBoxAdapter(child: SizedBox(height: 24)),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Delivery zone bar ────────────────────────────────────────────────────────
class _DeliveryZoneBar extends StatelessWidget {
  const _DeliveryZoneBar();

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {/* open zone picker */},
      child: Container(
        color: AppColors.grey100,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Row(
          children: [
            const Icon(Icons.location_on, size: 16, color: AppColors.primary),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                'Deliver to — tap to set location',
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(color: AppColors.grey700),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const Icon(Icons.keyboard_arrow_down, size: 18, color: AppColors.grey700),
          ],
        ),
      ),
    );
  }
}

// ── Banner carousel ───────────────────────────────────────────────────────────
class _BannerCarousel extends StatefulWidget {
  final List<String> banners;
  const _BannerCarousel({required this.banners});

  @override
  State<_BannerCarousel> createState() => _BannerCarouselState();
}

class _BannerCarouselState extends State<_BannerCarousel> {
  final _pageCtrl = PageController();
  int _current = 0;

  @override
  void dispose() {
    _pageCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 180,
          child: PageView.builder(
            controller: _pageCtrl,
            itemCount: widget.banners.length,
            onPageChanged: (i) => setState(() => _current = i),
            itemBuilder: (_, i) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: CachedNetworkImage(
                  imageUrl: widget.banners[i],
                  fit: BoxFit.cover,
                  placeholder: (_, __) => const ShimmerBox(height: 156),
                  errorWidget: (_, __, ___) => Container(color: AppColors.grey200),
                ),
              ),
            ),
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            widget.banners.length,
            (i) => AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: _current == i ? 18 : 6,
              height: 6,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(3),
                color: _current == i ? AppColors.primary : AppColors.grey300,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// ── Section header ─────────────────────────────────────────────────────────
class _SectionHeader extends SliverToBoxAdapter {
  _SectionHeader({required String title, required VoidCallback onSeeAll})
      : super(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.grey900,
                  ),
                ),
                TextButton(
                  onPressed: onSeeAll,
                  child: const Text('See all'),
                ),
              ],
            ),
          ),
        );
}

// ── Category row ────────────────────────────────────────────────────────────
class _CategoryRow extends StatelessWidget {
  final List<Map<String, dynamic>> categories;
  const _CategoryRow({required this.categories});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 90,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: categories.length,
        itemBuilder: (_, i) {
          final cat = categories[i];
          return GestureDetector(
            onTap: () => context.push('/categories?slug=${cat['slug']}'),
            child: Container(
              width: 72,
              margin: const EdgeInsets.symmetric(horizontal: 4),
              child: Column(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(36),
                    child: CachedNetworkImage(
                      imageUrl: cat['image_url'] as String? ?? '',
                      width: 56,
                      height: 56,
                      fit: BoxFit.cover,
                      errorWidget: (_, __, ___) =>
                          Container(width: 56, height: 56, color: AppColors.grey200),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    cat['name'] as String? ?? '',
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 11, color: AppColors.grey700),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

// ── Featured product row ────────────────────────────────────────────────────
class _FeaturedProductRow extends StatelessWidget {
  final String sectionSlug;
  const _FeaturedProductRow({required this.sectionSlug});

  @override
  Widget build(BuildContext context) {
    // Products loaded per-section via a separate provider (see catalog feature)
    return SizedBox(
      height: 220,
      child: Center(
        child: Text(
          'Products for $sectionSlug',
          style: const TextStyle(color: AppColors.grey500),
        ),
      ),
    );
  }
}

// ── Shimmer placeholder ─────────────────────────────────────────────────────
class _HomeShimmer extends StatelessWidget {
  const _HomeShimmer();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const ShimmerBox(height: 156, borderRadius: 12),
        const SizedBox(height: 20),
        Row(
          children: List.generate(
            4,
            (_) => const Padding(
              padding: EdgeInsets.only(right: 12),
              child: ShimmerBox(width: 64, height: 80, borderRadius: 8),
            ),
          ),
        ),
        const SizedBox(height: 20),
        const ShimmerBox(height: 200, borderRadius: 12),
      ],
    );
  }
}
