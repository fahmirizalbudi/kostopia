import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  String applicationTitle = "Ratun Kos";
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp(title: applicationTitle));
}

class MyApp extends StatelessWidget {
  final String title;

  const MyApp({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(
            context,
          ).copyWith(textScaler: TextScaler.noScaling),
          child: child!,
        );
      },
      debugShowCheckedModeBanner: false,
      title: title,
      home: const HomeScreen(),
    );
  }
}
