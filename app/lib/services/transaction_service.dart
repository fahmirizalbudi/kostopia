import 'dart:convert';
import 'dart:io';
import 'package:app/auth/auth.dart';
import 'package:app/models/transaction.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';

class TransactionService {
  late final String baseUrl = "${dotenv.env['API_URL']}/api/transactions";

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

  Future<List<Transaction>> getMy(String accessToken) async {
    final response = await http.get(
      Uri.parse("$baseUrl/me"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${Auth.getAccessToken()}",
      },
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      if (jsonData["data"] != null) {
        final List<dynamic> transactionList = jsonData["data"];
        return transactionList
            .map((json) => Transaction.fromJson(json))
            .toList();
      } else {
        return List.empty();
      }
    } else {
      return List.empty();
    }
  }
}
