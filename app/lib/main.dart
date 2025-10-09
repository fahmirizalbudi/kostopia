import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  String applicationTitle = "Ratun Kos";
  runApp(MyApp(title: applicationTitle));
}

class MyApp extends StatelessWidget {
  final String title;

  const MyApp({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: title,
      home: const HomeScreen()
    );
  }
}
