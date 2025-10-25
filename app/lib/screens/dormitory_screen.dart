import 'package:app/models/dormitory.dart';
import 'package:app/screens/home_screen.dart';
import 'package:app/utils/currency.dart';
import 'package:app/widgets/dormitory_facility.dart';
import 'package:app/widgets/exit_dialog.dart';
import 'package:app/widgets/rental_sheet.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart' hide Preview;
import 'package:app/models/preview.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DormitoryScreen extends StatelessWidget {
  final Dormitory dormitory;

  const DormitoryScreen({super.key, required this.dormitory});

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) async {
        await showDialog<bool>(
          context: context,
          barrierDismissible: false,
          builder: (context) => const ExitDialog(),
        );
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: Text(
            "Detail Kos",
            style: const TextStyle(
              fontWeight: FontWeight.w500,
              color: Colors.black,
              fontSize: 16,
            ),
          ),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
            color: Colors.black,
            onPressed: () => Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => HomeScreen()),
            ),
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
                    (dormitory.previews!.isNotEmpty
                            ? dormitory.previews
                            : [
                                Preview(
                                  id: 0,
                                  dormitoryId: dormitory.id,
                                  url: "https://placehold.co/400x200/png",
                                  createdAt: "",
                                ),
                              ])
                        ?.map((preview) {
                          return ClipRRect(
                            child: Image.network(
                              preview.url.replaceAll(
                                "localhost",
                                dotenv.env['API_IP'] ??
                                    "https://placehold.co/400x200/png",
                              ),
                              width: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          );
                        })
                        .toList(),
              ),

              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      dormitory.name,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w500,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 8),
                    RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: toRupiah(dormitory.price),
                            style: Theme.of(context).textTheme.bodyMedium!
                                .copyWith(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                          ),
                          TextSpan(
                            text: " / Bulan",
                            style: Theme.of(context).textTheme.bodyMedium!
                                .copyWith(
                                  fontSize: 13,
                                  color: Colors.grey,
                                  fontWeight: FontWeight.w500,
                                ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.location_on_outlined,
                          size: 19,
                          color: Colors.grey,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            dormitory.address,
                            style: const TextStyle(
                              fontSize: 14,
                              color: Colors.grey,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    const Text(
                      "Fasilitas",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: dormitory.facilities
                          .split(",")
                          .map((f) => DormitoryFacility(facility: f.trim()))
                          .toList(),
                    ),

                    const SizedBox(height: 20),

                    const Text(
                      "Deskripsi",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      dormitory.description.isNotEmpty
                          ? dormitory.description
                          : "Belum ada deskripsi untuk kos ini.",
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.black87,
                        height: 1.5,
                      ),
                    ),
                    SizedBox(height: 40),
                  ],
                ),
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            showModalBottomSheet(
              backgroundColor: Colors.white,
              context: context,
              isScrollControlled: true,
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
              ),
              builder: (context) => RentalSheet(dormitory: dormitory),
            );
          },
          backgroundColor: Color(0xFF1F4B43),
          elevation: 4,
          child: const Icon(Icons.money, color: Colors.white, size: 26),
        ),
      ),
    );
  }
}
