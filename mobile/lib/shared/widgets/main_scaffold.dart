import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/cart/presentation/controllers/cart_controller.dart';

class MainScaffold extends ConsumerWidget {
  final Widget child;
  const MainScaffold({super.key, required this.child});

  static const _tabs = [
    ('Home',     '/home',       Icons.home_outlined,       Icons.home),
    ('Shop',     '/categories', Icons.grid_view_outlined,  Icons.grid_view),
    ('Cart',     '/cart',       Icons.shopping_bag_outlined, Icons.shopping_bag),
    ('Orders',   '/orders',     Icons.receipt_long_outlined, Icons.receipt_long),
    ('Account',  '/profile',    Icons.person_outline,      Icons.person),
  ];

  int _currentIndex(String location) {
    for (var i = 0; i < _tabs.length; i++) {
      if (location.startsWith(_tabs[i].$2)) return i;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location    = GoRouterState.of(context).uri.toString();
    final currentIdx  = _currentIndex(location);
    final cartCount   = ref.watch(cartCountProvider);

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIdx,
        onTap: (i) => context.go(_tabs[i].$2),
        items: List.generate(_tabs.length, (i) {
          final tab = _tabs[i];
          final isCart = tab.$2 == '/cart';
          return BottomNavigationBarItem(
            icon: Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(tab.$3),
                if (isCart && cartCount > 0)
                  Positioned(
                    top: -4, right: -6,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        cartCount > 9 ? '9+' : '$cartCount',
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
              ],
            ),
            activeIcon: Icon(tab.$4),
            label: tab.$1,
          );
        }),
      ),
    );
  }
}
