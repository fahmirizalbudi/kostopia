import 'dart:convert';
import 'package:app/models/review.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class ReviewService {
  Future<List<Review>> getReviewsByDormitory(int dormitoryId) async {
    final response = await http.get(
      Uri.parse("${dotenv.env['API_URL']}/api/reviews/$dormitoryId/dormitory"),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      final List<dynamic> dormList = jsonData['data'];
      return dormList.map((json) => Review.fromJson(json)).toList();
    } else {
      return List.empty();
    }
  }
}
