import 'dart:convert';
import 'package:app/models/room.dart';
import 'package:http/http.dart' as http;

class RoomService {
  Future<List<Room>> fetchRooms(int dormitoryId) async {
    final String url =
        "http://192.168.43.205:8080/api/dormitories/$dormitoryId/rooms";
    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      final List<dynamic> roomList = jsonData['data'];
      return roomList.map((json) => Room.fromJson(json)).toList();
    }

    return List.empty();
  }

  Future<Room?> getById(int id, String? accessToken) async {
    final response = await http.get(
      Uri.parse("http://192.168.43.205:8080/api/rooms/$id"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $accessToken",
      },
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      final data = jsonData['data'];
      return Room.fromJson(data);
    } else {
      return null;
    }
  }
}
