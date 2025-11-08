import 'dart:convert';
import 'package:app/auth/auth.dart';
import 'package:app/models/user.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class UserService {
  late final String baseUrl = dotenv.env['API_URL'] ?? '';

  Future<User?> findUser(int id) async {
    final Uri url = Uri.parse('$baseUrl/api/users/$id');

    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${Auth.getAccessToken()}",
      },
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);

      final userData = data['data'] ?? data;
      return User.fromJson(userData);
    } else {
      return null;
    }
  }

  Future<bool> updateUser(User user) async {
    if (user.id == null) throw Exception("User ID tidak boleh null");

    final Uri url = Uri.parse('$baseUrl/api/users/${user.id}');
    final body = json.encode(user.toJson());

    final response = await http.put(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${Auth.getAccessToken()}",
      },
      body: body,
    );

    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }
}
