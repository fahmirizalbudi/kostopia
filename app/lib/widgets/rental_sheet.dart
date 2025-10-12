import 'package:app/models/dormitory.dart';
import 'package:app/models/room.dart';
import 'package:app/screens/transaction_screen.dart';
import 'package:app/services/rental_service.dart';
import 'package:app/services/room_service.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class RentalSheet extends StatefulWidget {
  final Dormitory dormitory;

  const RentalSheet({super.key, required this.dormitory});

  @override
  State<RentalSheet> createState() => _RentalSheetState();
}

class _RentalSheetState extends State<RentalSheet> {
  int? selectedRoom;
  final durationController = TextEditingController(text: null);
  DateTime? startDate;
  List<Room> rooms = [];

  @override
  void initState() {
    super.initState();
    durationController.addListener(() => setState(() {}));
    fetchRoomData(widget.dormitory.id);
  }

  @override
  void dispose() {
    durationController.dispose();
    super.dispose();
  }

  Future<void> fetchRoomData(int dormitoryId) async {
    final roomData = await RoomService().fetchRooms(dormitoryId);
    setState(() {
      rooms = roomData;
    });
  }

  @override
  Widget build(BuildContext context) {
    bool isFilled =
        selectedRoom != null &&
        startDate != null &&
        durationController.text.isNotEmpty;
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.7,
        minChildSize: 0.4,
        maxChildSize: 0.95,
        builder: (context, scrollController) {
          return SingleChildScrollView(
            controller: scrollController,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      height: 4,
                      width: 50,
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const Text(
                    "Rincian Penyewaan",
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 18),

                  const Text(
                    "Pilih Kamar",
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 10),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 10,
                          mainAxisSpacing: 10,
                          childAspectRatio: 3.2,
                        ),
                    itemCount: rooms.length,
                    itemBuilder: (context, index) {
                      final room = rooms[index];
                      final bool isSelected = selectedRoom == room.id;
                      final bool isDisabled = room.status == "rented";

                      return GestureDetector(
                        onTap: isDisabled
                            ? null
                            : () {
                                setState(() => selectedRoom = room.id as int);
                              },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: isSelected
                                  ? const Color(0xFF1F4B43)
                                  : isDisabled
                                  ? Colors.grey.shade300
                                  : Colors.grey.shade400,
                              width: 1,
                            ),
                            color: isSelected
                                ? const Color(
                                    0xFF1F4B43,
                                  ).withValues(alpha: 0.08)
                                : isDisabled
                                ? Colors.grey.shade200
                                : Colors.white,
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                isSelected
                                    ? Icons.radio_button_checked
                                    : Icons.radio_button_off,
                                size: 18,
                                color: isDisabled
                                    ? Colors.grey
                                    : isSelected
                                    ? const Color(0xFF1F4B43)
                                    : Colors.grey,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                room.roomNumber as String,
                                style: TextStyle(
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.w500,
                                  color: isDisabled
                                      ? Colors.grey
                                      : Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 20),

                  const Text(
                    "Mulai Sewa",
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    readOnly: true,
                    onTap: () async {
                      final pickedDate = await showDatePicker(
                        context: context,
                        initialDate: startDate ?? DateTime.now(),
                        firstDate: DateTime.now(),
                        lastDate: DateTime(2100),
                      );
                      if (pickedDate != null) {
                        setState(() => startDate = pickedDate);
                      }
                    },
                    decoration: InputDecoration(
                      hintText: "Pilih tanggal",
                      hintStyle: TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14.5,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        vertical: 14,
                        horizontal: 18,
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: Colors.grey.shade300),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: Colors.grey.shade400),
                      ),
                    ),

                    controller: TextEditingController(
                      text: startDate != null
                          ? "${startDate!.day}-${startDate!.month}-${startDate!.year}"
                          : "",
                    ),
                  ),

                  const SizedBox(height: 20),

                  const Text(
                    "Durasi Sewa (bulan)",
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: durationController,
                    keyboardType: TextInputType.number,

                    decoration: InputDecoration(
                      hintText: "Masukkan durasi",
                      hintStyle: TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14.5,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        vertical: 14,
                        horizontal: 18,
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: Colors.grey.shade300),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: Colors.grey.shade400),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: isFilled
                          ? () async {
                              final messenger = ScaffoldMessenger.of(context);
                              final (ok, rentalId) = await RentalService()
                                  .createRental({
                                    "room_id": selectedRoom,
                                    "start_date": DateFormat(
                                      'yyyy-MM-dd',
                                    ).format(startDate as DateTime),
                                    "duration_months": int.parse(
                                      durationController.text,
                                    ),
                                  });
                              messenger.showSnackBar(
                                SnackBar(
                                  content: Text(
                                    ok
                                        ? "Penyewaan berhasil dibuat!"
                                        : "Penyewaan gagal dibuat. Silakan coba lagi.",
                                  ),
                                ),
                              );
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      TransactionScreen(rentalId: rentalId),
                                ),
                              );
                              // Navigator.pop(context);
                            }
                          : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1F4B43),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        "Lanjutkan",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
