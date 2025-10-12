import 'package:app/models/room.dart';

class Rental {
  final int? id;
  final int? roomId;
  final int? tenantId;
  final String? startDate;
  final String? endDate;
  final int? durationMonths;
  final String? status;
  final Room? room;
  final String? createdAt;

  Rental({
    this.id,
    this.roomId,
    this.tenantId,
    this.startDate,
    this.endDate,
    this.durationMonths,
    this.status,
    this.room,
    this.createdAt,
  });

  factory Rental.fromJson(Map<String, dynamic> json) {
    return Rental(
      id: json['id'],
      roomId: json['room_id'],
      tenantId: json['tenant_id'],
      startDate: json['start_date'],
      endDate: json['end_date'],
      durationMonths: json['duration_months'],
      status: json['status'],
      room: json['room'] != null ? Room.fromJson(json['room']) : null,
      createdAt: json['created_at'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'room_id': roomId,
      'tenant_id': tenantId,
      'start_date': startDate,
      'end_date': endDate,
      'duration_months': durationMonths,
      'status': status,
      'room': room?.toJson(),
      'created_at': createdAt,
    };
  }
}
