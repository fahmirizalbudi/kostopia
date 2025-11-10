import 'package:app/auth/auth.dart';
import 'package:app/models/rental.dart';
import 'package:app/screens/history_screen.dart';
import 'package:app/services/transaction_service.dart';
import 'package:app/widgets/exit_dialog.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter/material.dart';

class MidtransScreen extends StatefulWidget {
  final Rental rental;
  final String purpose;
  final int duration;

  const MidtransScreen({
    super.key,
    required this.rental,
    required this.purpose,
    required this.duration,
  });

  @override
  State<MidtransScreen> createState() => _MidtransScreenState();
}

class _MidtransScreenState extends State<MidtransScreen> {
  String? redirectUrl;
  String? transactionId;

  @override
  void initState() {
    super.initState();
    initMidtrans();
  }

  Future<void> initMidtrans() async {
    int duration = widget.purpose == "new"
        ? widget.rental.durationMonths as int
        : widget.duration;
    final (redirectUrlData, transactionIdData) = await TransactionService()
        .snapMidtrans(
          Auth.getAccessToken() as String,
          widget.rental.id as int,
          duration,
          widget.purpose,
        );
    setState(() {
      redirectUrl = redirectUrlData;
      transactionId = transactionIdData;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (redirectUrl == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

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
        appBar: AppBar(
          title: const Text(
            "Pembayaran Midtrans",
            style: TextStyle(
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
              MaterialPageRoute(builder: (_) => HistoryScreen()),
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
        body: InAppWebView(
          initialUrlRequest: URLRequest(url: WebUri(redirectUrl as String)),
          initialSettings: InAppWebViewSettings(
            javaScriptEnabled: true,
            supportZoom: true,
            useWideViewPort: true,
            loadWithOverviewMode: true,
            builtInZoomControls: false,
            displayZoomControls: false,
          ),
          onWebViewCreated: (controller) async {},
          onLoadStop: (controller, url) async {
            try {
              await controller.zoomOut();
              await controller.zoomOut();
              await controller.setSettings(
                settings: InAppWebViewSettings(supportZoom: false),
              );
            } catch (e) {
              debugPrint("Zoom out failed: $e");
            }

            if (url.toString().contains("status_code=200")) {
              await TransactionService().changeStatus(
                transactionId as String,
                "success",
              );
              if (context.mounted) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const HistoryScreen(),
                  ),
                );
              }
            }
          },
        ),
      ),
    );
  }
}
