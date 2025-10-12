import 'dart:convert';
import 'dart:io';
import 'package:app/auth/auth.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';

class TransactionService {
  final String baseUrl = "http://192.168.43.205:8080/api/transactions";

  Future<(bool, String?)> createTransaction(
    Map<String, dynamic> transaction,
  ) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${Auth.getAccessToken()}",
      },
      body: jsonEncode(transaction),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      final data = jsonData["data"];
      final transactionId = data["id"] as String;
      return (true, transactionId);
    } else {
      return (false, null);
    }
  }

  Future<void> attachProof(File proof, String transactionId) async {
    final url = Uri.parse("$baseUrl/$transactionId/proof");

    final request = http.MultipartRequest("POST", url);

    final mimeType =
        lookupMimeType(proof.path)?.split('/') ?? ["image", "jpeg"];

    request.files.add(
      await http.MultipartFile.fromPath(
        "proof",
        proof.path,
        contentType: MediaType(mimeType[0], mimeType[1]),
      ),
    );

    await request.send();
  }
}
