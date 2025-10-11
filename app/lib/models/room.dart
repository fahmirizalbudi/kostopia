class Room {
  int? id;
  dynamic dormitoryId;
  String? roomNumber;
  String? status;
  String? createdAt;
  String? updatedAt;

  Room({
    this.id,
    this.dormitoryId,
    this.roomNumber,
    this.status,
    this.createdAt,
    this.updatedAt,
  });

  factory Room.fromJson(Map<String, dynamic> json) {
    return Room(
      id: json['id'],
      dormitoryId: json['dormitory_id'],
      roomNumber: json['room_number'],
      status: json['status'],
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'dormitory_id': dormitoryId,
      'room_number': roomNumber,
      'status': status,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }
}
