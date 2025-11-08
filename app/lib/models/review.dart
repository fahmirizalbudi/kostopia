class Review {
  final int? id;
  final int? rentalId;
  final double? rating;
  final String? comment;
  final String? reviewer;
  final String? createdAt;

  Review({
    this.id,
    this.rentalId,
    this.rating,
    this.comment,
    this.reviewer,
    this.createdAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] as int?,
      rentalId: json['rental_id'] as int?,
      rating: (json['rating'] != null)
          ? (json['rating'] is int
                ? (json['rating'] as int).toDouble()
                : json['rating'] as double)
          : null,
      comment: json['comment'] as String?,
      reviewer: json['reviewer'] as String?,
      createdAt: json['created_at'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'rental_id': rentalId,
      'rating': rating,
      'comment': comment,
      'reviewer': reviewer,
      'created_at': createdAt,
    };
  }
}
