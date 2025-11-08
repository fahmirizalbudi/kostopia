import 'dart:convert';

import 'package:app/screens/login_screen.dart';
import 'package:flutter/material.dart';

class Auth {
  static String? _accessToken;

  static session(String accessToken) {
    _accessToken = accessToken;
  }

  static String? getAccessToken() {
    return _accessToken;
  }

  static Map<String, dynamic>? _decodeJWT() {
    if (_accessToken == null) return null;

    final parts = _accessToken!.split('.');
    if (parts.length != 3) return null;

    final payload = parts[1];
    final normalized = base64Url.normalize(payload);
    final decoded = utf8.decode(base64Url.decode(normalized));

    return json.decode(decoded);
  }

  static int? getID() {
    final payload = _decodeJWT();
    if (payload == null) return null;

    return payload['id'] as int;
  }

  static String? getName() {
    final payload = _decodeJWT();
    if (payload == null) return null;

    return payload['name'];
  }

  static logout(BuildContext context) {
    _accessToken = null;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => LoginScreen()),
    );
  }
}
