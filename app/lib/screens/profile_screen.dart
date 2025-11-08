import 'package:app/auth/auth.dart';
import 'package:app/models/user.dart';
import 'package:app/screens/home_screen.dart';
import 'package:app/services/user_service.dart';
import 'package:app/widgets/profile_text_field.dart';
import 'package:flutter/material.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final formKey = GlobalKey<FormState>();
  User? authUser;

  @override
  void initState() {
    super.initState();
    fetchData(Auth.getID() as int);
    nameController = TextEditingController();
    emailController = TextEditingController();
    passwordController = TextEditingController();
    addressController = TextEditingController();
    phoneController = TextEditingController();
  }

  late TextEditingController nameController;
  late TextEditingController emailController;
  late TextEditingController passwordController;
  late TextEditingController addressController;
  late TextEditingController phoneController;

  bool isEditing = false;
  bool isSaving = false;

  Future<void> fetchData(int userId) async {
    final userData = await UserService().findUser(userId);
    setState(() {
      authUser = userData;
      nameController = TextEditingController(text: authUser?.name ?? "");
      emailController = TextEditingController(text: authUser?.email ?? "");
      passwordController = TextEditingController(
        text: authUser?.password ?? "",
      );
      addressController = TextEditingController(text: authUser?.address ?? "");
      phoneController = TextEditingController(text: authUser?.phone ?? "");
    });
  }

  void toggleEdit() {
    setState(() => isEditing = !isEditing);
  }

  Future<void> saveChanges() async {
    if (!formKey.currentState!.validate()) return;

    setState(() => isSaving = true);

    final updatedUser = User(
      id: authUser!.id,
      name: nameController.text,
      email: emailController.text,
      password: passwordController.text,
      address: addressController.text,
      phone: phoneController.text,
      role: authUser?.role,
    );

    await UserService().updateUser(updatedUser);

    await Future.delayed(const Duration(seconds: 2));

    setState(() {
      authUser = updatedUser;
      isSaving = false;
      isEditing = false;
    });

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Data profil berhasil diperbarui!"),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          color: Colors.black,
          onPressed: () => Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => HomeScreen()),
          ),
        ),
        title: const Text(
          "Profil Saya",
          style: TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.w500,
            color: Colors.black,
          ),
        ),
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: Colors.black),
        actions: [
          IconButton(
            icon: Icon(isEditing ? Icons.close : Icons.edit, size: 20),
            onPressed: toggleEdit,
            color: Colors.black,
          ),
        ],
        centerTitle: true,
        elevation: 0.3,
      ),
      backgroundColor: Colors.white,
      body: Padding(
        padding: const EdgeInsets.all(18.0),
        child: Form(
          key: formKey,
          child: ListView(
            children: [
              SizedBox(height: 8),
              ProfileTextField(
                label: "Nama",
                controller: nameController,
                enabled: isEditing,
                validator: (val) => val == null || val.isEmpty
                    ? "Nama tidak boleh kosong"
                    : null,
              ),
              const SizedBox(height: 16),

              ProfileTextField(
                label: "Email",
                controller: emailController,
                enabled: isEditing,
                keyboardType: TextInputType.emailAddress,
                validator: (val) {
                  if (val == null || val.isEmpty) return "Email wajib diisi";
                  if (!val.contains("@")) return "Email tidak valid";
                  return null;
                },
              ),
              const SizedBox(height: 16),

              ProfileTextField(
                label: "Password",
                controller: passwordController,
                isPassword: true,
                enabled: isEditing,
              ),

              const SizedBox(height: 16),

              ProfileTextField(
                label: "Alamat",
                controller: addressController,
                enabled: isEditing,
                validator: (val) => val == null || val.isEmpty
                    ? "Alamat tidak boleh kosong"
                    : null,
              ),
              const SizedBox(height: 16),

              ProfileTextField(
                label: "No. HP",
                controller: phoneController,
                enabled: isEditing,
                keyboardType: TextInputType.phone,
                validator: (val) =>
                    val == null || val.isEmpty ? "Nomor HP wajib diisi" : null,
              ),
              const SizedBox(height: 24),
              if (isEditing)
                ElevatedButton.icon(
                  onPressed: isSaving ? null : saveChanges,
                  icon: isSaving
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Icons.save_rounded),
                  label: Text(isSaving ? "Menyimpan..." : "Simpan Perubahan"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1F4B43),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
