import 'rental.dart';

class Transaction {
  String? id;
  int? rentalId;
  int? dormitoryPrice;
  int? monthPaid;
  int? amount;
  String? method;
  String? purpose;
  String? status;
  String? proof;
  Rental? rental;
  String? createdAt;

  Transaction({
    this.id,
    this.rentalId,
    this.dormitoryPrice,
    this.monthPaid,
    this.amount,
    this.method,
    this.purpose,
    this.status,
    this.proof,
    this.rental,
    this.createdAt,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id']?.toString(),
      rentalId: json['rental_id'],
      dormitoryPrice: json['dormitory_price'],
      monthPaid: json['month_paid'],
      amount: json['amount'],
      method: json['method'],
      purpose: json['purpose'],
      status: json['status'],
      proof: json['proof'],
      rental: json['rental'] != null ? Rental.fromJson(json['rental']) : null,
      createdAt: json['created_at'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'rental_id': rentalId,
      'dormitory_price': dormitoryPrice,
      'month_paid': monthPaid,
      'amount': amount,
      'method': method,
      'purpose': purpose,
      'status': status,
      'proof': proof,
      'rental': rental?.toJson(),
      'created_at': createdAt,
    };
  }
}
