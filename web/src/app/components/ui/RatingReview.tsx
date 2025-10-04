"use client"

type RatingReviewProps = {
  rating: number
  className?: string
  onRating?: (value: number) => void
  size: number
}

const RatingReview = ({ rating, className, size, onRating }: RatingReviewProps) => {
  return (
    <div style={{ display: "flex", gap: 1.5 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        return (
          <span
          key={star}
            className={className}
            style={{
              cursor: onRating ? "pointer" : "default",
              color: rating >= star ? "gold" : "rgba(0, 0, 0, 0.2)",
              fontSize: size,
            }}
            onClick={() => onRating?.(star)}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}

export default RatingReview
