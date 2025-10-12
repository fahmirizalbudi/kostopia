import 'package:app/auth/auth.dart';
import 'package:app/models/dormitory.dart';
import 'package:app/models/rental.dart';
import 'package:app/models/room.dart';
import 'package:app/services/dormitory_service.dart';
import 'package:app/services/rental_service.dart';
import 'package:app/services/room_service.dart';
import 'package:app/utils/currency.dart';
import 'package:app/widgets/proof_dialog.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class TransactionScreen extends StatefulWidget {
  final int? rentalId;

  const TransactionScreen({super.key, required this.rentalId});

  @override
  State<TransactionScreen> createState() => _TransactionScreenState();
}

class _TransactionScreenState extends State<TransactionScreen> {
  String? selectedPayment;
  Rental? rental;
  Room? room;
  Dormitory? dormitory;

  @override
  void initState() {
    super.initState();
    if (widget.rentalId != null) {
      fetchData(widget.rentalId!);
    }
  }

  Future<void> fetchData(int rentalId) async {
    final rentalData = await RentalService().getById(rentalId);
    final roomData = await RoomService().getById(
      rentalData?.roomId as int,
      Auth.getAccessToken(),
    );
    final dormitoryData = await DormitoryService().getById(
      roomData?.dormitoryId as int,
    );

    setState(() {
      rental = rentalData;
      room = roomData;
      dormitory = dormitoryData;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (rental == null || room == null || dormitory == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "Rincian Transaksi",
          style: TextStyle(
            fontWeight: FontWeight.w500,
            color: Colors.black,
            fontSize: 16,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          color: Colors.black,
          onPressed: () => Navigator.pop(context),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        toolbarHeight: 75,
        scrolledUnderElevation: 0,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(color: Colors.grey.shade300, width: 0.5),
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(0),
                bottomRight: Radius.circular(0),
              ),
              child: Image.network(
                "http://192.168.43.205:8080/uploads/bf84724f277ed842.png",
                width: double.infinity,
                height: 240,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 16),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.05),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "${dormitory?.name} - ${room?.roomNumber}",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 12),
                        _detailItem(
                          "Mulai Sewa",
                          DateFormat(
                            'yyyy-MM-dd',
                          ).format(DateTime.parse(rental?.startDate as String)),
                        ),
                        const SizedBox(height: 8),
                        _detailItem(
                          "Lama Sewa",
                          "${rental?.durationMonths} Bulan",
                        ),
                        const Divider(height: 28, thickness: 0.5),
                        _detailItem(
                          "Total Pembayaran",
                          toRupiah(
                            (dormitory?.price as int) *
                                (rental?.durationMonths as int),
                          ),
                          bold: true,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 30),

                  const Text(
                    "Metode Pembayaran",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 12),

                  Column(
                    children: [
                      _paymentOption("Cash"),
                      const SizedBox(height: 10),
                      _paymentOption("Transfer"),
                      const SizedBox(height: 10),
                      _paymentOption("E-Wallet"),
                    ],
                  ),

                  const SizedBox(height: 40),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: selectedPayment == null
                          ? null
                          : () {
                              if (selectedPayment == "transfer") {
                                showDialog(
                                  context: context,
                                  builder: (context) =>
                                      ProofDialog(rental: rental as Rental),
                                );
                              }
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1F4B43),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        disabledBackgroundColor: Colors.grey.shade300,
                        disabledForegroundColor: Colors.grey.shade600,
                      ),
                      child: const Text(
                        "Bayar Sekarang",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _detailItem(String label, String value, {bool bold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 14, color: Colors.black87),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: bold ? 16 : 14,
            fontWeight: bold ? FontWeight.w600 : FontWeight.w500,
            color: bold ? Colors.black : Colors.black87,
          ),
        ),
      ],
    );
  }

  Widget _paymentOption(String label) {
    final normalizedValue = label.replaceAll("-", "").toLowerCase();
    final isSelected = selectedPayment == normalizedValue;

    return InkWell(
      onTap: () {
        setState(() => selectedPayment = normalizedValue);
      },
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? const Color(0xFF1F4B43) : Colors.grey.shade300,
            width: isSelected ? 1.4 : 1,
          ),
          borderRadius: BorderRadius.circular(10),
          color: isSelected
              ? const Color(0xFF1F4B43).withValues(alpha: 0.08)
              : Colors.white,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: isSelected ? const Color(0xFF1F4B43) : Colors.black87,
              ),
            ),
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
              size: 22,
              color: isSelected ? const Color(0xFF1F4B43) : Colors.grey,
            ),
          ],
        ),
      ),
    );
  }
}
