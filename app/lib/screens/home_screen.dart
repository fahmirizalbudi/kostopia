import 'package:app/models/dormitory.dart';
import 'package:app/services/dormitory_service.dart';
import 'package:app/widgets/dormitory_card.dart';
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
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
        title: Padding(
          padding: EdgeInsets.symmetric(vertical: 20),
          child: Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundImage: NetworkImage(
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
                ),
              ),
              const SizedBox(width: 14),
              SizedBox(
                height: 40,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Fahmirizal",
                      textAlign: TextAlign.start,
                      style: TextStyle(
                        fontFamily: 'SFProText',
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Colors.black,
                      ),
                    ),
                    Text(
                      "Mau Cari Kos-kosan?",
                      textAlign: TextAlign.start,
                      style: TextStyle(
                        fontFamily: 'SFProText',
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        color: Color(0xffB2B2B2),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        actions: [
          PopupMenuButton<int>(
            icon: Icon(Icons.more_vert, color: Colors.black, size: 20),
            onSelected: (value) {
              if (value == 1) {
                print("Profil");
              } else if (value == 2) {
                print("Log Out");
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(value: 1, child: Text("Profil")),
              PopupMenuItem(value: 2, child: Text("Log Out")),
            ],
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        child: FutureBuilder<List<Dormitory>>(
          future: DormitoryService().fetchDormitories(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return Center(child: Text('Kos tidak ditemukan'));
            } else {
              final dormitories = snapshot.data!;
              return ListView.separated(
                itemCount: dormitories.length,
                separatorBuilder: (context, index) =>
                    const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  return DormitoryCard(dormitory: dormitories[index]);
                },
              );
            }
          },
        ),
      ),
    );
  }
}
