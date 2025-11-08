import 'package:app/models/transaction.dart';
import 'package:app/widgets/transaction_card.dart';
import 'package:app/widgets/success_dialog.dart';
import 'package:flutter/material.dart';

class TransactionsFragment extends StatelessWidget {
  final List<Transaction> transactions;
  final Future<void> Function() onRefresh;
  const TransactionsFragment({
    super.key,
    required this.transactions,
    required this.onRefresh,
  });

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: ListView.builder(
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: transactions.length,
        itemBuilder: (context, index) {
          final transaction = transactions[index];
          return InkWell(
            onTap: () {
              if (transaction.status!.toLowerCase() == 'success') {
                showDialog(
                  context: context,
                  builder: (context) => SuccessDialog(transaction: transaction),
                );
              } else {}
            },
            borderRadius: BorderRadius.circular(12),
            child: TransactionCard(transaction: transaction),
          );
        },
      ),
    );
  }
}
