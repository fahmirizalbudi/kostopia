import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  Future<(bool, String?)> login(String email, String password) async {
    final String baseUrl = "http://192.168.43.205:8080/api/auth";

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
