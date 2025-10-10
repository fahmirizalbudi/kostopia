import 'package:app/models/preview.dart';

class Dormitory {
  final int id;
  final String name;
  final String address;
  final String description;
  final int price;
  final String facilities;
  final String googleMaps;
  final List<Preview> previews;
  final String createdAt;
  final String updatedAt;

  Dormitory({
    required this.id,
    required this.name,
    required this.address,
    required this.description,
    required this.price,
    required this.facilities,
    required this.googleMaps,
    required this.previews,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Dormitory.fromJson(Map<String, dynamic> json) {
    return Dormitory(
      id: json['id'] as int,
      name: json['name'] as String,
      address: json['address'] as String,
      description: json['description'] as String,
      price: json['price'] as int,
      facilities: json['facilities'] as String,
      googleMaps: json['google_maps'] as String,
      previews: (json['previews'] as List<dynamic>)
          .map((p) => Preview.fromJson(p))
          .toList(),
      createdAt: json['created_at'] as String,
      updatedAt: json['updated_at'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'address': address,
      'description': description,
      'price': price,
      'facilities': facilities,
      'google_maps': googleMaps,
      'previews': previews,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }
}
