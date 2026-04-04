import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/storage/local_storage.dart';
import '../../../../shared/widgets/product_card.dart';
import '../controllers/catalog_controller.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _ctrl = TextEditingController();
  final _focusNode = FocusNode();
  Timer? _debounce;
  String _query = '';
  List<String> _recent = [];

  @override
  void initState() {
    super.initState();
    _recent = LocalStorage.getRecentSearches();
    _focusNode.requestFocus();
  }

  void _onChanged(String val) {
    _debounce?.cancel();
    _debounce = Timer(
      const Duration(milliseconds: AppConstants.searchDebounceMs),
      () => setState(() => _query = val.trim()),
    );
  }

  void _submitSearch(String q) {
    if (q.trim().isEmpty) return;
    LocalStorage.addRecentSearch(q.trim());
    setState(() {
      _query = q.trim();
      _recent = LocalStorage.getRecentSearches();
    });
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _ctrl.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _ctrl,
          focusNode: _focusNode,
          decoration: const InputDecoration(
            hintText: 'Search products...',
            border: InputBorder.none,
            filled: false,
          ),
          onChanged: _onChanged,
          onSubmitted: _submitSearch,
          textInputAction: TextInputAction.search,
        ),
        actions: [
          if (_ctrl.text.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                _ctrl.clear();
                setState(() => _query = '');
              },
            ),
        ],
      ),
      body: _query.isEmpty ? _RecentSearches(
        recent: _recent,
        onTap: (q) {
          _ctrl.text = q;
          _submitSearch(q);
        },
        onClear: () async {
          await LocalStorage.clearRecentSearches();
          setState(() => _recent = []);
        },
      ) : _SearchResults(query: _query),
    );
  }
}

class _RecentSearches extends StatelessWidget {
  final List<String> recent;
  final void Function(String) onTap;
  final VoidCallback onClear;

  const _RecentSearches({
    required this.recent,
    required this.onTap,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    if (recent.isEmpty) {
      return const Center(
        child: Text('Search for products, brands, categories...'),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 8, 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Recent', style: Theme.of(context).textTheme.titleMedium),
              TextButton(onPressed: onClear, child: const Text('Clear')),
            ],
          ),
        ),
        ...recent.map((q) => ListTile(
              leading: const Icon(Icons.history, color: AppColors.grey500),
              title: Text(q),
              onTap: () => onTap(q),
            )),
      ],
    );
  }
}

class _SearchResults extends ConsumerWidget {
  final String query;
  const _SearchResults({required this.query});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final params = ProductListParams(search: query);
    final resultsAsync = ref.watch(productListProvider(params));

    return resultsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Error: $e')),
      data: (state) {
        if (state.products.isEmpty) {
          return const Center(child: Text('No products found.'));
        }
        return GridView.builder(
          padding: const EdgeInsets.all(12),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2, childAspectRatio: 0.68,
            crossAxisSpacing: 10, mainAxisSpacing: 10,
          ),
          itemCount: state.products.length,
          itemBuilder: (_, i) {
            final p = state.products[i];
            return ProductCard(
              name: p.name,
              thumbnailUrl: p.thumbnailUrl ?? '',
              price: p.basePrice,
              originalPrice: p.originalPrice,
              rating: p.rating,
              onTap: () => context.push('/product/${p.slug}'),
            );
          },
        );
      },
    );
  }
}
