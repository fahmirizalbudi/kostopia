import 'package:app/models/transaction.dart';
import 'package:app/widgets/transaction_card.dart';
import 'package:flutter/material.dart';

class TransactionsFragment extends StatelessWidget {
  final List<Transaction> transactions;
  const TransactionsFragment({super.key, required this.transactions});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: transactions.length,
      itemBuilder: (context, index) {
        final transaction = transactions[index];
        return TransactionCard(transaction: transaction);
      },
    );
  }
}
