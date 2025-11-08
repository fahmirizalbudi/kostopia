import 'package:app/models/dormitory.dart';
import 'package:app/models/review.dart';
import 'package:app/screens/home_screen.dart';
import 'package:app/services/review_service.dart';
import 'package:app/utils/currency.dart';
import 'package:app/widgets/dormitory_facility.dart';
import 'package:app/widgets/exit_dialog.dart';
import 'package:app/widgets/rental_sheet.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart' hide Preview;
import 'package:app/models/preview.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:intl/intl.dart';

class DormitoryScreen extends StatefulWidget {
  final Dormitory dormitory;
  const DormitoryScreen({super.key, required this.dormitory});

  @override
  State<DormitoryScreen> createState() => _DormitoryScreenState();
}

class _DormitoryScreenState extends State<DormitoryScreen> {
  List<Review> reviews = [];

  @override
  void initState() {
    super.initState();
    fetchData(widget.dormitory.id);
  }

  Future<void> fetchData(int dormitoryId) async {
    final reviewsData = await ReviewService().getReviewsByDormitory(
      dormitoryId,
    );
    setState(() {
      reviews = reviewsData;
    });
  }

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
                    (widget.dormitory.previews!.isNotEmpty
                            ? widget.dormitory.previews
                            : [
                                Preview(
                                  id: 0,
                                  dormitoryId: widget.dormitory.id,
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
                      widget.dormitory.name,
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
                            text: toRupiah(widget.dormitory.price),
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
                            widget.dormitory.address,
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
                      children: widget.dormitory.facilities
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
                      widget.dormitory.description.isNotEmpty
                          ? widget.dormitory.description
                          : "Belum ada deskripsi untuk kos ini.",
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.black87,
                        height: 1.5,
                      ),
                    ),

                    const SizedBox(height: 20),

                    if (reviews.isNotEmpty) ...[
                      Text(
                        "Ulasan Penghuni",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 8),

                      Column(
                        children: reviews.map((review) {
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade50,
                              borderRadius: BorderRadius.circular(8),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.03),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      review.reviewer as String,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 14,
                                      ),
                                    ),
                                    Row(
                                      children: List.generate(5, (index) {
                                        if (index < review.rating!.floor()) {
                                          return const Icon(
                                            Icons.star,
                                            color: Colors.amber,
                                            size: 16,
                                          );
                                        } else if (index <
                                            (review.rating ?? 0)) {
                                          return const Icon(
                                            Icons.star_half,
                                            color: Colors.amber,
                                            size: 16,
                                          );
                                        } else {
                                          return const Icon(
                                            Icons.star_border,
                                            color: Colors.grey,
                                            size: 16,
                                          );
                                        }
                                      }),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  review.comment as String,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: Colors.black87,
                                    height: 1.4,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  DateFormat('yyyy-MM-dd').format(
                                    DateTime.parse(review.createdAt as String),
                                  ),
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: Colors.grey,
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 20),
                    ],
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
              builder: (context) => RentalSheet(dormitory: widget.dormitory),
            );
          },
          backgroundColor: Color(0xFF1F4B43),
          elevation: 4,
          child: const Icon(Icons.add, color: Colors.white, size: 26),
        ),
      ),
    );
  }
}
