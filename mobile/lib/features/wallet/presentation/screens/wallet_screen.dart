import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../../../shared/widgets/error_view.dart';
import '../../../../shared/widgets/loading_shimmer.dart';

final _walletProvider =
    FutureProvider.autoDispose<Map<String, dynamic>>((ref) async {
  final client = await ref.watch(dioClientProvider.future);
  final res = await client.get(ApiConstants.wallet, forceRefresh: true);
  return res.data['data'] as Map<String, dynamic>? ?? {};
});

final _walletTxProvider =
    FutureProvider.autoDispose<List<Map<String, dynamic>>>((ref) async {
  final client = await ref.watch(dioClientProvider.future);
  final res = await client.get(ApiConstants.walletTransactions);
  return (res.data['data'] as List? ?? []).cast<Map<String, dynamic>>();
});

class WalletScreen extends ConsumerWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final walletAsync = ref.watch(_walletProvider);
    final txAsync     = ref.watch(_walletTxProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('My Wallet')),
      body: walletAsync.when(
        loading: () => const _WalletShimmer(),
        error: (e, _) => ErrorView(message: e.toString()),
        data: (wallet) => Column(
          children: [
            // Balance card
            Container(
              width: double.infinity,
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, AppColors.primaryDark],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Available Balance',
                      style: TextStyle(color: Colors.white70, fontSize: 14)),
                  const SizedBox(height: 8),
                  Text(
                    CurrencyFormatter.formatCompact(
                        wallet['balance'] as num? ?? 0),
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 32,
                        fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {/* launch wallet recharge */},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: AppColors.primary,
                    ),
                    child: const Text('Add Money'),
                  ),
                ],
              ),
            ),

            // Transactions
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text('Transactions',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
              ),
            ),

            Expanded(
              child: txAsync.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => ErrorView(message: e.toString()),
                data: (txs) => txs.isEmpty
                    ? const Center(child: Text('No transactions yet.'))
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        itemCount: txs.length,
                        itemBuilder: (_, i) => _TxTile(tx: txs[i]),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TxTile extends StatelessWidget {
  final Map<String, dynamic> tx;
  const _TxTile({required this.tx});

  @override
  Widget build(BuildContext context) {
    final isCredit = tx['type'] == 'credit';
    final amount   = (tx['amount'] as num? ?? 0).toDouble();

    return ListTile(
      leading: CircleAvatar(
        backgroundColor: isCredit
            ? AppColors.success.withValues(alpha: 26)
            : AppColors.error.withValues(alpha: 26),
        child: Icon(
          isCredit ? Icons.arrow_downward : Icons.arrow_upward,
          color: isCredit ? AppColors.success : AppColors.error,
          size: 18,
        ),
      ),
      title: Text(tx['description'] as String? ?? (isCredit ? 'Credit' : 'Debit')),
      subtitle: Text(DateFormatter.timeAgo(tx['created_at'] as String? ?? '')),
      trailing: Text(
        '${isCredit ? '+' : '-'}${CurrencyFormatter.formatCompact(amount)}',
        style: TextStyle(
          color: isCredit ? AppColors.success : AppColors.error,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _WalletShimmer extends StatelessWidget {
  const _WalletShimmer();
  @override
  Widget build(BuildContext context) => const Padding(
    padding: EdgeInsets.all(16),
    child: Column(children: [
      ShimmerBox(height: 160, borderRadius: 16),
      SizedBox(height: 16),
      ShimmerBox(height: 60, borderRadius: 12),
      SizedBox(height: 8),
      ShimmerBox(height: 60, borderRadius: 12),
    ]),
  );
}
