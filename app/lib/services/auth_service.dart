import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AuthService {
  Future<(bool, String?)> login(String email, String password) async {
    late final String baseUrl = "${dotenv.env['API_URL']}/api/auth";

    final response = await http.post(
      Uri.parse("$baseUrl/login"),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final accessToken = data["data"] as String;
      return (true, accessToken);
    } else {
      return (false, null);
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String address,
  }) async {
    late final String baseUrl = "${dotenv.env['API_URL']}/api/auth";
    final response = await http.post(
      Uri.parse("$baseUrl/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "name": name,
        "email": email,
        "password": password,
        "phone": phone,
        "address": address,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return true;
    } else {
      return false;
    }
  }
}
