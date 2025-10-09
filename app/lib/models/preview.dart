class Preview {
  final int id;
  final int dormitoryId;
  final String url;
  final String createdAt;

  Preview({
    required this.id,
    required this.dormitoryId,
    required this.url,
    required this.createdAt,
  });

  factory Preview.fromJson(Map<String, dynamic> json) {
    return Preview(
      id: json['id'] as int,
      dormitoryId: json['dormitory_id'] as int,
      url: json['url'] as String,
      createdAt: json['created_at'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'dormitory_id': dormitoryId,
      'url': url,
      'created_at': createdAt,
    };
  }
}
