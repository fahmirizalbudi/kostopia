import 'dart:io';
import 'package:app/models/transaction.dart';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:permission_handler/permission_handler.dart';

class SuccessDialog extends StatelessWidget {
  final Transaction transaction;
  const SuccessDialog({super.key, required this.transaction});

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
                "Transaksi Berhasil",
                style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'ID: ${transaction.id}\nJumlah: ${transaction.amount}\nMetode: ${transaction.method}',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 15.25, height: 1.4),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () async {
                    final messenger = ScaffoldMessenger.of(context);
                    Navigator.pop(context);

                    final status = await Permission.storage.request();
                    if (!status.isGranted) {
                      messenger.showSnackBar(
                        const SnackBar(content: Text('Izin storage ditolak')),
                      );
                      return;
                    }

                    try {
                      final url =
                          "http://192.168.43.205:8080/api/transactions/${transaction.id}/receipt";

                      final directory = Directory(
                        '/storage/emulated/0/Download',
                      );
                      if (!await directory.exists()) {
                        await directory.create(recursive: true);
                      }

                      final filePath =
                          '${directory.path}/${transaction.id}_receipt.pdf';

                      final response = await Dio().get(
                        url,
                        options: Options(responseType: ResponseType.bytes),
                      );

                      final file = File(filePath);
                      await file.writeAsBytes(response.data);

                      messenger.showSnackBar(
                        SnackBar(
                          content: Text(
                            'Kuitansi berhasil di-download ke ${file.path}',
                          ),
                        ),
                      );
                    } catch (e) {
                      messenger.showSnackBar(
                        SnackBar(content: Text('Download gagal: $e')),
                      );
                    }
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
                    "Kuitansi",
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
