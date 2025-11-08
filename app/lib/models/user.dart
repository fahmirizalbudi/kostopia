class User {
  final int? id;
  final String? name;
  final String? email;
  final String? role;
  final String? password;
  final String? phone;
  final String? address;
  final String? createdAt;
  final String? updatedAt;

  User({
    this.id,
    this.name,
    this.email,
    this.role,
    this.password,
    this.phone,
    this.address,
    this.createdAt,
    this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      role: json['role'],
      password: json['password'],
      phone: json['phone'],
      address: json['address'],
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "name": name,
      "email": email,
      "role": role,
      "password": password,
      "phone": phone,
      "address": address,
      "created_at": createdAt,
      "updated_at": updatedAt,
    };
  }
}
