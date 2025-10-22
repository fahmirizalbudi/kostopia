import 'package:app/auth/auth.dart';
import 'package:app/models/dormitory.dart';
import 'package:app/models/rental.dart';
import 'package:app/models/room.dart';
import 'package:app/models/preview.dart';
import 'package:app/services/dormitory_service.dart';
import 'package:app/services/preview_service.dart';
import 'package:app/services/room_service.dart';
import 'package:flutter/material.dart' hide Preview;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:intl/intl.dart';

class RentalCard extends StatefulWidget {
  final Rental rental;
  const RentalCard({super.key, required this.rental});

  @override
  State<RentalCard> createState() => _RentalCardState();
}

class _RentalCardState extends State<RentalCard> {
  Room? room;
  Dormitory? dormitory;
  bool loading = true;
  List<Preview> previews = [];

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    final roomData = await RoomService().getById(
      widget.rental.roomId!,
      Auth.getAccessToken(),
    );
    final dormitoryData = await DormitoryService().getById(
      roomData?.dormitoryId as int,
    );
    final previewData = await PreviewService().getByDormitoryId(
      dormitoryData?.id as int,
    );
    setState(() {
      room = roomData;
      dormitory = dormitoryData;
      previews = previewData;
      loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return loading
        ? const SizedBox(height: 100)
        : Container(
            margin: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 5),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      previews.isNotEmpty
                          ? previews.first.url.replaceAll(
                              "localhost",
                              dotenv.env['API_IP'] ?? "localhost",
                            )
                          : "https://placehold.co/100x100/png",
                      width: 85,
                      height: 85,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(width: 18),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "${dormitory?.name} - ${room?.roomNumber}",
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "Mulai: ${DateFormat('yyyy-MM-dd').format(DateTime.parse(widget.rental.startDate as String))}",
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                      Text(
                        "Lama: ${widget.rental.durationMonths} Bulan",
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                      Text(
                        "Selesai: ${DateFormat('yyyy-MM-dd').format(DateTime.parse(widget.rental.endDate as String))}",
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          _StatusChip(label: widget.rental.status as String),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
  }
}

class _StatusChip extends StatelessWidget {
  final String label;
  const _StatusChip({required this.label});

  @override
  Widget build(BuildContext context) {
    Color bgColor = Colors.grey.shade300;
    Color textColor = Colors.black;
    String displayLabel = label;

    final s = label.toLowerCase();

    if (s == 'pending') {
      bgColor = const Color(0xFFFFF3CD);
      textColor = const Color(0xFF856404);
      displayLabel = 'Menunggu';
    } else if (s == 'active') {
      bgColor = const Color(0xFFD4EDDA);
      textColor = const Color(0xFF155724);
      displayLabel = 'Aktif';
    } else if (s == 'finished' || s == 'lunas' || s == 'selesai') {
      bgColor = const Color(0xFFD4EDDA);
      textColor = const Color(0xFF155724);
      displayLabel = 'Selesai';
    } else if (s == 'canceled' || s == 'ditolak' || s == 'dibatalkan') {
      bgColor = const Color(0xFFF8D7DA);
      textColor = const Color(0xFF721C24);
      displayLabel = 'Dibatalkan';
    }

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 10),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        displayLabel,
        style: TextStyle(
          fontSize: 11.5,
          color: textColor,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
