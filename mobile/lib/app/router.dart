import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/storage/secure_storage.dart';
import '../features/auth/presentation/screens/splash_screen.dart';
import '../features/auth/presentation/screens/onboarding_screen.dart';
import '../features/auth/presentation/screens/login_screen.dart';
import '../features/auth/presentation/screens/otp_screen.dart';
import '../features/auth/presentation/screens/register_screen.dart';
import '../features/home/presentation/screens/home_screen.dart';
import '../features/catalog/presentation/screens/category_screen.dart';
import '../features/catalog/presentation/screens/product_detail_screen.dart';
import '../features/catalog/presentation/screens/search_screen.dart';
import '../features/catalog/presentation/screens/store_screen.dart';
import '../features/cart/presentation/screens/cart_screen.dart';
import '../features/wishlist/presentation/screens/wishlist_screen.dart';
import '../features/checkout/presentation/screens/checkout_screen.dart';
import '../features/checkout/presentation/screens/order_confirmation_screen.dart';
import '../features/orders/presentation/screens/orders_screen.dart';
import '../features/orders/presentation/screens/order_detail_screen.dart';
import '../features/delivery_tracking/presentation/screens/tracking_screen.dart';
import '../features/wallet/presentation/screens/wallet_screen.dart';
import '../features/profile/presentation/screens/profile_screen.dart';
import '../features/notifications/presentation/screens/notifications_screen.dart';
import '../features/support/presentation/screens/support_screen.dart';
import '../shared/widgets/main_scaffold.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final secureStorage = ref.watch(secureStorageProvider);

  return GoRouter(
    initialLocation: '/splash',
    debugLogDiagnostics: false,
    redirect: (context, state) async {
      final isAuthenticated = await secureStorage.hasToken();
      final isAuthRoute = state.matchedLocation.startsWith('/login') ||
          state.matchedLocation.startsWith('/otp') ||
          state.matchedLocation.startsWith('/register') ||
          state.matchedLocation.startsWith('/onboarding') ||
          state.matchedLocation.startsWith('/splash');

      if (!isAuthenticated && !isAuthRoute) return '/login';
      return null;
    },
    routes: [
      // --- Auth routes ---
      GoRoute(path: '/splash',     builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingScreen()),
      GoRoute(path: '/login',      builder: (_, __) => const LoginScreen()),
      GoRoute(
        path: '/otp',
        builder: (_, state) {
          final phone = state.uri.queryParameters['phone'] ?? '';
          return OtpScreen(phone: phone);
        },
      ),
      GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),

      // --- Main shell with bottom nav ---
      ShellRoute(
        builder: (context, state, child) => MainScaffold(child: child),
        routes: [
          GoRoute(path: '/home',       builder: (_, __) => const HomeScreen()),
          GoRoute(path: '/categories', builder: (_, __) => const CategoryScreen()),
          GoRoute(path: '/cart',       builder: (_, __) => const CartScreen()),
          GoRoute(path: '/orders',     builder: (_, __) => const OrdersScreen()),
          GoRoute(path: '/profile',    builder: (_, __) => const ProfileScreen()),
        ],
      ),

      // --- Product & store routes ---
      GoRoute(
        path: '/product/:slug',
        builder: (_, state) => ProductDetailScreen(slug: state.pathParameters['slug']!),
      ),
      GoRoute(
        path: '/store/:slug',
        builder: (_, state) => StoreScreen(slug: state.pathParameters['slug']!),
      ),
      GoRoute(path: '/search', builder: (_, __) => const SearchScreen()),

      // --- Commerce routes ---
      GoRoute(path: '/checkout',            builder: (_, __) => const CheckoutScreen()),
      GoRoute(
        path: '/order-confirmation/:slug',
        builder: (_, state) => OrderConfirmationScreen(orderSlug: state.pathParameters['slug']!),
      ),
      GoRoute(
        path: '/order/:slug',
        builder: (_, state) => OrderDetailScreen(orderSlug: state.pathParameters['slug']!),
      ),
      GoRoute(
        path: '/track/:slug',
        builder: (_, state) => TrackingScreen(orderSlug: state.pathParameters['slug']!),
      ),

      // --- Other routes ---
      GoRoute(path: '/wishlist',      builder: (_, __) => const WishlistScreen()),
      GoRoute(path: '/wallet',        builder: (_, __) => const WalletScreen()),
      GoRoute(path: '/notifications', builder: (_, __) => const NotificationsScreen()),
      GoRoute(path: '/support',       builder: (_, __) => const SupportScreen()),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(child: Text('Page not found: ${state.uri}')),
    ),
  );
});
