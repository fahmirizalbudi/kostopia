import 'dart:io';

import 'package:app/models/rental.dart';
import 'package:app/services/transaction_service.dart';
import 'package:app/utils/image.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class ProofDialog extends StatelessWidget {
  final Rental rental;
  const ProofDialog({super.key, required this.rental});

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
              "Upload Bukti Transfer",
              style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text("Pilih dari Gallery"),
              onTap: () async {
                final messenger = ScaffoldMessenger.of(context);
                Navigator.pop(context);
                final proof = await pickImage(ImageSource.gallery);
                final (ok, transactionId) = await TransactionService()
                    .createTransaction({
                      "rental_id": rental.id,
                      "month_paid": rental.durationMonths,
                      "purpose": "new",
                      "method": "transfer",
                      "status": "pending",
                    });
                if (ok) {
                  if (proof != null) {
                    await TransactionService().attachProof(
                      File(proof.path),
                      transactionId as String,
                    );
                  }
                  messenger.showSnackBar(
                    SnackBar(
                      content: Text(
                        ok
                            ? "Bukti berhasil diunggah!"
                            : "Bukti gagal diunggah. Silakan coba lagi.",
                      ),
                    ),
                  );
                  await Future.delayed(const Duration(seconds: 4));
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}
