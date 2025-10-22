import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:app/models/preview.dart';

class PreviewService {
  late final String baseUrl = "${dotenv.env['API_URL']}/api/";

  Future<List<Preview>> getByDormitoryId(int dormitoryId) async {
    late final String url =
        "${dotenv.env['API_URL']}/api/dormitories/$dormitoryId/previews";

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final List<dynamic> data = body['data'];

      return data.map((json) => Preview.fromJson(json)).toList();
    } else {
      return List.empty();
    }
  }
}
