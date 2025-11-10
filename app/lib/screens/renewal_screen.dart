import 'package:app/screens/history_screen.dart';
import 'package:app/screens/midtrans_screen.dart';
import 'package:app/services/rental_service.dart';
import 'package:app/widgets/cash_dialog.dart';
import 'package:app/widgets/proof_dialog.dart';
import 'package:flutter/material.dart' hide Preview;
import 'package:intl/intl.dart';
import 'package:app/models/dormitory.dart';
import 'package:app/models/room.dart';
import 'package:app/models/preview.dart';
import 'package:app/utils/currency.dart';
import 'package:app/services/dormitory_service.dart';
import 'package:app/services/room_service.dart';
import 'package:app/services/preview_service.dart';
import 'package:app/models/rental.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:app/auth/auth.dart';

class RenewalScreen extends StatefulWidget {
  final int rentalId;

  const RenewalScreen({super.key, required this.rentalId});

  @override
  State<RenewalScreen> createState() => _RenewalScreenState();
}

class _RenewalScreenState extends State<RenewalScreen> {
  String? selectedPayment;
  Rental? rental;
  Room? room;
  Dormitory? dormitory;
  List<Preview> previews = [];
  late TextEditingController durationController;

  int durationMonths = 1;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    durationMonths = 1;
    durationController = TextEditingController(text: durationMonths.toString());
    fetchData();
  }

  @override
  void dispose() {
    durationController.dispose();
    super.dispose();
  }

  Future<void> fetchData() async {
    final rentalData = await RentalService().getById(widget.rentalId);
    final roomData = await RoomService().getById(
      rentalData?.roomId as int,
      Auth.getAccessToken(),
    );
    final dormData = await DormitoryService().getById(
      roomData?.dormitoryId as int,
    );
    final previewData = await PreviewService().getByDormitoryId(
      dormData?.id as int,
    );

    setState(() {
      rental = rentalData;
      room = roomData;
      dormitory = dormData;
      previews = previewData;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (rental == null || room == null || dormitory == null) {
      return const Scaffold(body: Center(child: Text("Data tidak ditemukan.")));
    }

    final startDate = DateFormat('dd MMM yyyy').format(DateTime.now());
    final totalPrice = (dormitory!.price * durationMonths);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "Perpanjangan Sewa",
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
            CarouselSlider(
              options: CarouselOptions(
                height: 240,
                viewportFraction: 1.0,
                enableInfiniteScroll: false,
                enlargeCenterPage: false,
              ),
              items:
                  (previews.isNotEmpty
                          ? previews
                          : [
                              Preview(
                                id: 0,
                                dormitoryId: dormitory?.id ?? 0,
                                url: "https://placehold.co/400x200/png",
                                createdAt: "",
                              ),
                            ])
                      .map((preview) {
                        return ClipRRect(
                          borderRadius: BorderRadius.circular(0),
                          child: Image.network(
                            preview.url.replaceAll(
                              "localhost",
                              dotenv.env['API_IP'] ??
                                  "https://placehold.co/400x200/png",
                            ),
                            width: double.infinity,
                            height: 240,
                            fit: BoxFit.cover,
                          ),
                        );
                      })
                      .toList(),
            ),

            const SizedBox(height: 16),

            Container(
              padding: const EdgeInsets.all(16),
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
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 12),
                  _detailItem("Perpanjang Mulai", startDate),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Lama Perpanjangan",
                        style: TextStyle(fontSize: 14, color: Colors.black87),
                      ),
                      Row(
                        children: [
                          SizedBox(
                            width: 70,
                            height: 36,
                            child: TextField(
                              textAlign: TextAlign.center,
                              keyboardType: TextInputType.number,
                              decoration: InputDecoration(
                                contentPadding: const EdgeInsets.symmetric(
                                  vertical: 6,
                                ),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              controller: durationController,
                              onChanged: (v) {
                                final parsed = int.tryParse(v);
                                if (parsed != null && parsed > 0) {
                                  setState(() => durationMonths = parsed);
                                }
                              },
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            "Bulan",
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const Divider(height: 28, thickness: 0.5),
                  _detailItem("Harga per Bulan", toRupiah(dormitory!.price)),
                  const SizedBox(height: 8),
                  _detailItem(
                    "Total Perpanjangan",
                    toRupiah(totalPrice),
                    bold: true,
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
                          : () async {
                              if (selectedPayment == "transfer") {
                                await showDialog(
                                  context: context,
                                  builder: (context) => ProofDialog(
                                    rental: rental as Rental,
                                    purpose: "renewal",
                                    duration: durationMonths,
                                  ),
                                );
                              } else if (selectedPayment == "cash") {
                                await showDialog(
                                  context: context,
                                  builder: (context) => CashDialog(
                                    rental: rental as Rental,
                                    purpose: "renewal",
                                    duration: durationMonths,
                                  ),
                                );
                              } else if (selectedPayment == "ewallet") {
                                Navigator.pushAndRemoveUntil(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => MidtransScreen(
                                      purpose: "renewal",
                                      rental: rental as Rental,
                                      duration: durationMonths,
                                    ),
                                  ),
                                  (route) => false,
                                );
                              }
                              await Future.delayed(const Duration(seconds: 2));
                              if (context.mounted &&
                                  (selectedPayment == "transfer" ||
                                      selectedPayment == "cash")) {
                                Navigator.pushAndRemoveUntil(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => const HistoryScreen(),
                                  ),
                                  (route) => false,
                                );
                              }
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1F4B43),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: const Text(
                        "Perpanjang Sekarang",
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
