import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../features/auth/presentation/controllers/auth_controller.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('My Account')),
      body: ListView(
        children: [
          // User info header
          Container(
            padding: const EdgeInsets.all(20),
            color: AppColors.primary.withOpacity(0.05),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 36,
                  backgroundImage: user?.avatarUrl != null
                      ? NetworkImage(user!.avatarUrl!)
                      : null,
                  child: user?.avatarUrl == null
                      ? Text(
                          (user?.name.isNotEmpty == true)
                              ? user!.name[0].toUpperCase()
                              : '?',
                          style: const TextStyle(fontSize: 24),
                        )
                      : null,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(user?.name ?? 'Guest',
                          style: const TextStyle(
                              fontWeight: FontWeight.w700, fontSize: 18)),
                      if (user?.email != null)
                        Text(user!.email!,
                            style: const TextStyle(
                                color: AppColors.grey700, fontSize: 13)),
                      if (user?.phone != null)
                        Text(user!.phone!,
                            style: const TextStyle(
                                color: AppColors.grey700, fontSize: 13)),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.edit_outlined),
                  onPressed: () {/* navigate to edit profile */},
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Menu items
          _MenuItem(
            icon: Icons.shopping_bag_outlined,
            label: 'My Orders',
            onTap: () => context.push('/orders'),
          ),
          _MenuItem(
            icon: Icons.favorite_border,
            label: 'Wishlist',
            onTap: () => context.push('/wishlist'),
          ),
          _MenuItem(
            icon: Icons.account_balance_wallet_outlined,
            label: 'Wallet',
            onTap: () => context.push('/wallet'),
          ),
          _MenuItem(
            icon: Icons.location_on_outlined,
            label: 'Saved Addresses',
            onTap: () {/* navigate to addresses */},
          ),
          _MenuItem(
            icon: Icons.support_agent_outlined,
            label: 'Help & Support',
            onTap: () => context.push('/support'),
          ),
          _MenuItem(
            icon: Icons.notifications_outlined,
            label: 'Notifications',
            onTap: () => context.push('/notifications'),
          ),

          const Divider(height: 24),

          _MenuItem(
            icon: Icons.logout,
            label: 'Logout',
            color: AppColors.error,
            onTap: () => _confirmLogout(context, ref),
          ),
          _MenuItem(
            icon: Icons.delete_outline,
            label: 'Delete Account',
            color: AppColors.error,
            onTap: () => _confirmDeleteAccount(context, ref),
          ),

          const SizedBox(height: 24),
          Center(
            child: Text('LCommerce v1.0.0',
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(color: AppColors.grey500)),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  void _confirmLogout(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ref.read(authControllerProvider.notifier).logout();
              context.go('/login');
            },
            child: const Text('Logout',
                style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }

  void _confirmDeleteAccount(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete Account'),
        content: const Text(
            'This will permanently delete your account and all data. This cannot be undone.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: call delete account API then logout
            },
            child: const Text('Delete',
                style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color? color;

  const _MenuItem({
    required this.icon,
    required this.label,
    required this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) => ListTile(
    leading: Icon(icon, color: color ?? AppColors.grey700),
    title: Text(label, style: TextStyle(color: color)),
    trailing: const Icon(Icons.chevron_right, size: 20, color: AppColors.grey500),
    onTap: onTap,
  );
}
