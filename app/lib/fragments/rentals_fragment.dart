import 'package:app/models/rental.dart';
import 'package:app/widgets/rental_action.dart';
import 'package:app/widgets/rental_card.dart';
import 'package:flutter/material.dart';

class RentalsFragment extends StatelessWidget {
  final List<Rental> rentals;
  final Future<void> Function() onRefresh;
  const RentalsFragment({
    super.key,
    required this.rentals,
    required this.onRefresh,
  });

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: ListView.builder(
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: rentals.length,
        itemBuilder: (context, index) {
          final rental = rentals[index];
          return InkWell(
            onTap: () {
              if (rental.status!.toLowerCase() == 'finished') {
                showDialog(
                  context: context,
                  builder: (context) => RentalAction(rental: rental),
                );
              } else {}
            },
            borderRadius: BorderRadius.circular(12),
            child: RentalCard(rental: rental),
          );
        },
      ),
    );
  }
}
