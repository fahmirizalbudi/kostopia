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
}
