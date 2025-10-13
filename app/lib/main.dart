import 'package:app/screens/login_screen.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  await dotenv.load(fileName: ".env");
  String applicationTitle = "Ratun Kos";
  runApp(MyApp(title: applicationTitle));
}

class MyApp extends StatelessWidget {
  final String title;

  const MyApp({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(textTheme: GoogleFonts.outfitTextTheme()),
      debugShowCheckedModeBanner: false,
      title: title,
      home: const LoginScreen(),
    );
  }
}
