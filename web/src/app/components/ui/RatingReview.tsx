type RatingReviewProps = {
  rating: number
  className?: string
  onRating?: () => void
  size: number
}

const RatingReview = ({ rating, className, size, onRating }: RatingReviewProps) => {
  return (
    <div style={{ display: "flex", gap: 1.5 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        return (
          <span
            className={className}
            style={{
              cursor: "pointer",
              color: rating >= star ? "gold" : "gray",
              fontSize: size,
            }}
            onClick={onRating}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}

export default RatingReview
