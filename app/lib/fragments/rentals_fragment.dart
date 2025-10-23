import 'package:app/models/rental.dart';
import 'package:app/widgets/rental_card.dart';
import 'package:flutter/material.dart';

class RentalsFragment extends StatelessWidget {
  final List<Rental> rentals;
  const RentalsFragment({super.key, required this.rentals});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: rentals.length,
      itemBuilder: (context, index) {
        final rental = rentals[index];
        return RentalCard(rental: rental);
      },
    );
  }
}
