import 'package:app/models/rental.dart';
import 'package:app/screens/renewal_screen.dart';
import 'package:app/widgets/rating_dialog.dart';
import 'package:flutter/material.dart';

class RentalAction extends StatelessWidget {
  final Rental rental;
  final String type;
  const RentalAction({super.key, required this.rental, required this.type});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "Aksi Rental",
              style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            if (type == "active") ...[
              ListTile(
              leading: const Icon(Icons.hourglass_bottom),
              title: const Text("Perpanjang Sewa"),
              onTap: () async {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        RenewalScreen(rentalId: rental.id as int),
                  ),
                );
              },
            ),
            ]
            else if (type == "finished") ...[
              ListTile(
                leading: const Icon(Icons.star),
                title: const Text("Berikan Ulasan"),
                onTap: () async {
                  showDialog(
                    context: context,
                    builder: (context) => RatingDialog(rental: rental),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}
