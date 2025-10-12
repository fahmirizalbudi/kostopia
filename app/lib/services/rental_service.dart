import 'dart:convert';
import 'package:app/auth/auth.dart';
import 'package:app/models/rental.dart';
import 'package:http/http.dart' as http;

class RentalService {
  final String baseUrl = "http://192.168.43.205:8080/api/rentals";

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
}
