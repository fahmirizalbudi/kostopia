import 'package:app/models/rental.dart';
import 'package:app/services/transaction_service.dart';
import 'package:flutter/material.dart';

class CashDialog extends StatelessWidget {
  final Rental rental;
  final String purpose;
  final int duration;

  const CashDialog({
    super.key,
    required this.rental,
    required this.purpose,
    required this.duration,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Center(
              child: Text(
                "Pembayaran Tunai",
                style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 12),

            const Text(
              "Silakan lakukan pembayaran secara langsung kepada pemilik kos. Transaksi akan berstatus Menunggu (pending) sampai admin mengonfirmasi.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 15.25, height: 1.4),
            ),
            const SizedBox(height: 24),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    side: BorderSide(width: 1, color: Colors.grey[300]!),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                  ),
                  child: const Text(
                    "Cancel",
                    style: TextStyle(color: Colors.black54),
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed: () async {
                    final messenger = ScaffoldMessenger.of(context);
                    Navigator.pop(context);
                    int duration = purpose == "new"
                        ? rental.durationMonths as int
                        : this.duration;
                    final (ok, _) = await TransactionService()
                        .createTransaction({
                          "rental_id": rental.id,
                          "month_paid": duration,
                          "purpose": purpose,
                          "method": "cash",
                          "status": "pending",
                        });
                    messenger.showSnackBar(
                      SnackBar(
                        content: Text(
                          ok
                              ? "Transaksi cash berhasil dibuat!"
                              : "Transaksi gagal. Silakan coba lagi.",
                        ),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1F4B43),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                  ),
                  child: const Text(
                    "Submit",
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
