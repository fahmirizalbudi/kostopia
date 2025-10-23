import 'package:app/models/dormitory.dart';
import 'package:app/models/preview.dart';
import 'package:app/models/transaction.dart';
import 'package:app/services/dormitory_service.dart';
import 'package:app/services/preview_service.dart';
import 'package:app/utils/currency.dart';
import 'package:flutter/material.dart' hide Preview;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class TransactionCard extends StatefulWidget {
  final Transaction transaction;
  const TransactionCard({super.key, required this.transaction});

  @override
  State<TransactionCard> createState() => _TransactionCardState();
}

class _TransactionCardState extends State<TransactionCard> {
  Dormitory? dormitory;
  List<Preview> previews = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    final dormitoryData = await DormitoryService().getById(
      widget.transaction.rental?.room?.dormitoryId as int,
    );
    final previewData = await PreviewService().getByDormitoryId(
      dormitoryData?.id as int,
    );
    setState(() {
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
                        "${widget.transaction.id} - ${toRupiah(widget.transaction.amount as int)}",
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "Tipe: ${dormitory?.name}",
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                      Text(
                        "Kamar: ${widget.transaction.rental?.room?.roomNumber}",
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                      Text(
                        "Keperluan: ${widget.transaction.purpose == "new" ? "Sewa Baru" : "Perpanjang Sewa"}",
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          _MethodChip(
                            label: widget.transaction.method as String,
                          ),
                          SizedBox(width: 8),
                          _StatusChip(
                            label: widget.transaction.status as String,
                          ),
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
    } else if (s == 'success') {
      bgColor = const Color(0xFFD4EDDA);
      textColor = const Color(0xFF155724);
      displayLabel = 'Lunas';
    } else {
      bgColor = const Color(0xFFF8D7DA);
      textColor = const Color(0xFF721C24);
      displayLabel = 'Ditolak';
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

class _MethodChip extends StatelessWidget {
  final String label;
  const _MethodChip({required this.label});

  @override
  Widget build(BuildContext context) {
    Color bgColor = Color(0xFFE0E0E0);
    Color textColor = Color(0xFF6C6C6C);
    String displayLabel = label;

    final m = label.toLowerCase();

    if (m == 'ewallet') {
      displayLabel = 'E-Wallet';
    } else if (m == 'transfer') {
      displayLabel = 'Transfer';
    } else {
      displayLabel = 'Cash';
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
