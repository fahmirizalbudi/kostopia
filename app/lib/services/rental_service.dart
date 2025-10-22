import 'dart:convert';
import 'package:app/auth/auth.dart';
import 'package:app/models/rental.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class RentalService {
  late final String baseUrl = "${dotenv.env['API_URL']}/api/rentals";

  Future<(bool, int?)> createRental(Map<String, dynamic> rental) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${Auth.getAccessToken()}",
      },
      body: jsonEncode(rental),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      final data = jsonData['data'];
      final rentalId = data['id'] as int;
      return (true, rentalId);
    } else {
      return (false, null);
    }
  }

  Future<Rental?> getById(int id) async {
    final response = await http.get(Uri.parse("$baseUrl/$id"));

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      final data = jsonData['data'];
      return Rental.fromJson(data);
    } else {
      return null;
    }
  }

  Future<List<Rental>> getMy(String accessToken) async {
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
        final List<dynamic> rentalList = jsonData["data"];
        return rentalList.map((json) => Rental.fromJson(json)).toList();
      } else {
        return List.empty();
      }
    } else {
      return List.empty();
    }
  }
}
