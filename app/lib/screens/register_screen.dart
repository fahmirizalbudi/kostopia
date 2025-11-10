import 'package:app/screens/login_screen.dart';
import 'package:app/services/auth_service.dart';
import 'package:app/widgets/exit_dialog.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final phoneController = TextEditingController();
  final addressController = TextEditingController();

  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    final greenColor = const Color(0xFF1F4B43);

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
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 32),
                Center(
                  child: SvgPicture.asset('assets/favicon.svg', height: 60),
                ),
                const SizedBox(height: 32),
                const Text(
                  'Sign Up',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Daftarkan diri Anda untuk melanjutkan.',
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
                const SizedBox(height: 32),

                const Text('Nama Lengkap', style: TextStyle(fontSize: 14)),
                const SizedBox(height: 6),
                TextField(
                  controller: nameController,
                  decoration: _inputDecoration("Nama lengkap Anda"),
                  keyboardType: TextInputType.name,
                ),
                const SizedBox(height: 20),

                const Text('Email', style: TextStyle(fontSize: 14)),
                const SizedBox(height: 6),
                TextField(
                  controller: emailController,
                  decoration: _inputDecoration("domain@example.com"),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 20),

                const Text('Password', style: TextStyle(fontSize: 14)),
                const SizedBox(height: 6),
                TextField(
                  controller: passwordController,
                  decoration: _inputDecoration("Masukkan password"),
                  obscureText: true,
                ),
                const SizedBox(height: 20),

                const Text('No. Seluler', style: TextStyle(fontSize: 14)),
                const SizedBox(height: 6),
                TextField(
                  controller: phoneController,
                  decoration: _inputDecoration("08xxxxxxxxxx"),
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 20),

                const Text('Alamat', style: TextStyle(fontSize: 14)),
                const SizedBox(height: 6),
                TextField(
                  controller: addressController,
                  decoration: _inputDecoration("Alamat lengkap Anda"),
                  maxLines: 2,
                ),

                const SizedBox(height: 32),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: greenColor,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    onPressed: isLoading
                        ? null
                        : () async {
                            setState(() => isLoading = true);

                            String name = nameController.text;
                            String email = emailController.text;
                            String password = passwordController.text;
                            String phone = phoneController.text;
                            String address = addressController.text;

                            final ok = await AuthService().register(
                              name: name,
                              email: email,
                              password: password,
                              phone: phone,
                              address: address,
                            );

                            setState(() => isLoading = false);

                            if (ok) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    "Registrasi sukses, Diarahkan ke halaman Log In.",
                                  ),
                                ),
                              );
                              Navigator.pushAndRemoveUntil(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => const LoginScreen(),
                                ),
                                (route) => false,
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    "Registrasi gagal. Periksa data dan coba lagi.",
                                  ),
                                ),
                              );
                            }
                          },
                    child: isLoading
                        ? const SizedBox(
                            height: 18,
                            width: 18,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const Text(
                            'Register',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                  ),
                ),

                const SizedBox(height: 24),

                Row(
                  children: [
                    Expanded(
                      child: Divider(color: Colors.grey[300], thickness: 1),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Text(
                        'Or log in with',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                    Expanded(
                      child: Divider(color: Colors.grey[300], thickness: 1),
                    ),
                  ],
                ),

                const SizedBox(height: 32),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text("Already have an account? "),
                    GestureDetector(
                      onTap: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LoginScreen(),
                          ),
                        );
                      },
                      child: Text(
                        "Log In",
                        style: TextStyle(
                          color: greenColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14.5),
      contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 18),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: Colors.grey.shade400),
      ),
    );
  }
}
