import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/error_view.dart';
import '../../../../shared/widgets/loading_shimmer.dart';

final _ticketsProvider =
    FutureProvider.autoDispose<List<Map<String, dynamic>>>((ref) async {
  final client = await ref.watch(dioClientProvider.future);
  final res = await client.get(ApiConstants.supportTickets);
  return (res.data['data'] as List? ?? []).cast<Map<String, dynamic>>();
});

class SupportScreen extends ConsumerWidget {
  const SupportScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ticketsAsync = ref.watch(_ticketsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Help & Support')),
      body: Column(
        children: [
          // Create ticket button
          Padding(
            padding: const EdgeInsets.all(16),
            child: AppButton(
              label: 'Create New Ticket',
              onPressed: () => _showCreateTicketSheet(context, ref),
            ),
          ),

          const Divider(height: 1),
          const Padding(
            padding: EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text('My Tickets',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
            ),
          ),

          Expanded(
            child: ticketsAsync.when(
              loading: () => const _TicketShimmer(),
              error: (e, _) => ErrorView(message: e.toString()),
              data: (tickets) => tickets.isEmpty
                  ? const Center(child: Text('No tickets yet.'))
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      itemCount: tickets.length,
                      itemBuilder: (_, i) => _TicketCard(ticket: tickets[i]),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  void _showCreateTicketSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => const _CreateTicketSheet(),
    );
  }
}

class _TicketCard extends StatelessWidget {
  final Map<String, dynamic> ticket;
  const _TicketCard({required this.ticket});

  @override
  Widget build(BuildContext context) {
    final status = ticket['status'] as String? ?? 'open';
    final isOpen = status == 'open';

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        title: Text(ticket['subject'] as String? ?? 'Ticket',
            style: const TextStyle(fontWeight: FontWeight.w500)),
        subtitle: Text(
            DateFormatter.timeAgo(ticket['created_at'] as String? ?? '')),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: isOpen
                ? AppColors.success.withValues(alpha: 26)
                : AppColors.grey200,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            status.toUpperCase(),
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: isOpen ? AppColors.success : AppColors.grey500,
            ),
          ),
        ),
        onTap: () {/* open ticket detail */},
      ),
    );
  }
}

class _CreateTicketSheet extends ConsumerStatefulWidget {
  const _CreateTicketSheet();

  @override
  ConsumerState<_CreateTicketSheet> createState() => _CreateTicketSheetState();
}

class _CreateTicketSheetState extends ConsumerState<_CreateTicketSheet> {
  final _subjectCtrl = TextEditingController();
  final _bodyCtrl    = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _subjectCtrl.dispose();
    _bodyCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_subjectCtrl.text.trim().isEmpty || _bodyCtrl.text.trim().isEmpty) return;
    setState(() => _loading = true);
    try {
      final client = await ref.read(dioClientProvider.future);
      await client.post(ApiConstants.supportTickets, data: {
        'subject': _subjectCtrl.text.trim(),
        'message': _bodyCtrl.text.trim(),
      });
      if (mounted) {
        Navigator.pop(context);
        ref.invalidate(_ticketsProvider);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed: $e')));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 16, right: 16, top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('New Support Ticket',
              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18)),
          const SizedBox(height: 16),
          TextField(
            controller: _subjectCtrl,
            decoration: const InputDecoration(labelText: 'Subject'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _bodyCtrl,
            decoration: const InputDecoration(labelText: 'Describe your issue'),
            maxLines: 4,
          ),
          const SizedBox(height: 16),
          AppButton(
            label: 'Submit Ticket',
            isLoading: _loading,
            onPressed: _loading ? null : _submit,
          ),
        ],
      ),
    );
  }
}

class _TicketShimmer extends StatelessWidget {
  const _TicketShimmer();
  @override
  Widget build(BuildContext context) => ListView.builder(
    padding: const EdgeInsets.symmetric(horizontal: 12),
    itemCount: 3,
    itemBuilder: (_, __) => const Padding(
      padding: EdgeInsets.only(bottom: 8),
      child: ShimmerBox(height: 64, borderRadius: 12),
    ),
  );
}
