import 'dart:io';
import 'package:app/models/transaction.dart';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:permission_handler/permission_handler.dart';

class SuccessDialog extends StatelessWidget {
  final Transaction transaction;
  const SuccessDialog({super.key, required this.transaction});

  Future<void> downloadPdf(BuildContext context) async {
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

      final directory = Directory('/storage/emulated/0/Download');
      if (!await directory.exists()) {
        await directory.create(recursive: true);
      }

      final filePath = '${directory.path}/${transaction.id}_receipt.pdf';

      final response = await Dio().get(
        url,
        options: Options(responseType: ResponseType.bytes),
      );

      final file = File(filePath);
      await file.writeAsBytes(response.data);

      messenger.showSnackBar(
        SnackBar(
          content: Text('Kuitansi berhasil di-download ke ${file.path}'),
        ),
      );
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text('Download gagal: $e')));
    }
  }

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
              "Aksi Transaksi",
              style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.file_download),
              title: const Text("Unduh Kuitansi"),
              onTap: () async {
                downloadPdf(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}
