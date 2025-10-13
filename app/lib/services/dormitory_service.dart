import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:app/models/dormitory.dart';

class DormitoryService {
  late final String baseUrl = "${dotenv.env['API_URL']}/api/dormitories";

  Future<List<Dormitory>> fetchDormitories() async {
    final response = await http.get(Uri.parse("$baseUrl/previews"));

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      final List<dynamic> dormList = jsonData['data'];
      return dormList.map((json) => Dormitory.fromJson(json)).toList();
    } else {
      return List.empty();
    }
  }

  Future<Dormitory?> getById(int id) async {
    final response = await http.get(Uri.parse("$baseUrl/$id"));

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      final data = jsonData['data'];
      return Dormitory.fromJson(data);
    } else {
      return null;
    }
  }
}
