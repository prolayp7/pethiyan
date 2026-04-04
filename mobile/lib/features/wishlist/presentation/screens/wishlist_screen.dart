import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../shared/widgets/error_view.dart';
import '../../../../shared/widgets/loading_shimmer.dart';
import '../controllers/wishlist_controller.dart';

class WishlistScreen extends ConsumerStatefulWidget {
  const WishlistScreen({super.key});

  @override
  ConsumerState<WishlistScreen> createState() => _WishlistScreenState();
}

class _WishlistScreenState extends ConsumerState<WishlistScreen> {
  @override
  void initState() {
    super.initState();
    // Load items for first list automatically
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final state = ref.read(wishlistProvider).value;
      if (state != null && state.lists.isNotEmpty) {
        ref.read(wishlistProvider.notifier)
            .loadItems(state.lists.first['id'].toString());
      }
    });
  }

  @override
  Widget build(BuildContext context, ) {
    final wishlistAsync = ref.watch(wishlistProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Wishlist'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'New List',
            onPressed: () => _showCreateListDialog(context),
          ),
        ],
      ),
      body: wishlistAsync.when(
        loading: () => const _WishlistShimmer(),
        error:   (e, _) => ErrorView(message: e.toString()),
        data: (state) {
          if (state.lists.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.favorite_border, size: 80, color: AppColors.grey300),
                  SizedBox(height: 16),
                  Text('No wishlists yet',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                ],
              ),
            );
          }

          return Column(
            children: [
              // List tabs
              SizedBox(
                height: 44,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  itemCount: state.lists.length,
                  itemBuilder: (_, i) {
                    final list = state.lists[i];
                    final isActive = state.activeListId == list['id'].toString();
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text('${list['title']} (${list['item_count'] ?? 0})'),
                        selected: isActive,
                        onSelected: (_) => ref
                            .read(wishlistProvider.notifier)
                            .loadItems(list['id'].toString()),
                      ),
                    );
                  },
                ),
              ),
              // Items grid
              Expanded(
                child: state.activeItems.isEmpty
                    ? const Center(child: Text('This list is empty.'))
                    : GridView.builder(
                        padding: const EdgeInsets.all(12),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2, childAspectRatio: 0.72,
                          crossAxisSpacing: 10, mainAxisSpacing: 10,
                        ),
                        itemCount: state.activeItems.length,
                        itemBuilder: (_, i) {
                          final item = state.activeItems[i];
                          return _WishlistItemCard(item: item);
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showCreateListDialog(BuildContext context) {
    final ctrl = TextEditingController();
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('New Wishlist'),
        content: TextField(
          controller: ctrl,
          decoration: const InputDecoration(hintText: 'List name'),
          autofocus: true,
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              if (ctrl.text.trim().isNotEmpty) {
                ref.read(wishlistProvider.notifier).createList(ctrl.text.trim());
                Navigator.pop(context);
              }
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }
}

class _WishlistItemCard extends ConsumerWidget {
  final WishlistItem item;
  const _WishlistItemCard({required this.item});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => context.push('/product/${item.productId}'),
                  child: ClipRRect(
                    borderRadius:
                        const BorderRadius.vertical(top: Radius.circular(12)),
                    child: CachedNetworkImage(
                      imageUrl: item.thumbnailUrl ?? '',
                      fit: BoxFit.cover,
                      width: double.infinity,
                      errorWidget: (_, __, ___) =>
                          Container(color: AppColors.grey200),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item.productName,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            fontSize: 12, fontWeight: FontWeight.w500)),
                    const SizedBox(height: 4),
                    Text(
                      CurrencyFormatter.formatCompact(item.price),
                      style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          color: AppColors.priceDiscounted),
                    ),
                  ],
                ),
              ),
            ],
          ),
          Positioned(
            top: 6, right: 6,
            child: GestureDetector(
              onTap: () =>
                  ref.read(wishlistProvider.notifier).removeItem(item.id),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.close, size: 16, color: AppColors.grey700),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _WishlistShimmer extends StatelessWidget {
  const _WishlistShimmer();
  @override
  Widget build(BuildContext context) => GridView.builder(
    padding: const EdgeInsets.all(12),
    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
      crossAxisCount: 2, childAspectRatio: 0.72,
      crossAxisSpacing: 10, mainAxisSpacing: 10,
    ),
    itemCount: 4,
    itemBuilder: (_, __) => const ShimmerBox(borderRadius: 12),
  );
}
