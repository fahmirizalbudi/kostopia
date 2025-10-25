import 'package:app/auth/auth.dart';
import 'package:app/fragments/rentals_fragment.dart';
import 'package:app/fragments/transactions_fragment.dart';
import 'package:app/models/rental.dart';
import 'package:app/models/transaction.dart';
import 'package:app/screens/home_screen.dart';
import 'package:app/services/rental_service.dart';
import 'package:app/services/transaction_service.dart';
import 'package:app/widgets/exit_dialog.dart';
import 'package:flutter/material.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  List<Rental> rentals = [];
  List<Transaction> transactions = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchRentals();
  }

  Future<void> fetchRentals() async {
    final rentalsData = await RentalService().getMy(
      Auth.getAccessToken() as String,
    );
    final transactionsData = await TransactionService().getMy(
      Auth.getAccessToken() as String,
    );

    setState(() {
      rentals = rentalsData;
      transactions = transactionsData;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) async {
        await showDialog<bool>(
          context: context,
          barrierDismissible: false,
          builder: (context) => const ExitDialog(),
        );
      },
      child: DefaultTabController(
        length: 2,
        child: Scaffold(
          bottomNavigationBar: TabBar(
            indicatorColor: Color(0xFF1F4B43),
            labelColor: Color(0xFF1F4B43),
            unselectedLabelColor: Colors.grey,
            labelStyle: Theme.of(
              context,
            ).textTheme.bodyMedium!.copyWith(fontWeight: FontWeight.w500),
            tabs: [
              Tab(text: "Penyewaan"),
              Tab(text: "Transaksi"),
            ],
          ),
          backgroundColor: Colors.white,
          appBar: AppBar(
            title: Text(
              "Histori",
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.black,
                fontSize: 16,
              ),
            ),
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
              color: Colors.black,
              onPressed: () => Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => HomeScreen()),
              ),
            ),
            centerTitle: true,
            backgroundColor: Colors.white,
            toolbarHeight: 75,
            scrolledUnderElevation: 0,
            flexibleSpace: Container(
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(color: Colors.grey.shade300, width: 0.5),
                ),
              ),
            ),
          ),
          body: isLoading
              ? const Center(child: CircularProgressIndicator())
              : TabBarView(
                  children: [
                    RentalsFragment(rentals: rentals, onRefresh: fetchRentals),
                    TransactionsFragment(
                      transactions: transactions,
                      onRefresh: fetchRentals,
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
