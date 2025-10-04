import { Dormitory } from "@/app/types/dormitory"
import styles from "../page.module.scss"
import { getReviewsByDormitory } from "@/app/data-access/reviews"

const ReviewSection = async (dormitory: Dormitory) => {
  const reviews = await getReviewsByDormitory({
    where: dormitory.id as number,
  })

  if (!reviews || reviews.length === 0) return null

  return (
    <section className={styles.reviewsSection}>
      <h2 className={styles.reviewsTitle}>Ulasan Penghuni</h2>
      <div className={styles.reviewList}>
        {reviews?.map((review) => (
          <div className={styles.reviewItem} key={review.id}>
            <div className={styles.reviewer}>
              {review.reviewer} &nbsp;- ⭐ {review.rating}
            </div>
            <p className={styles.comment}>{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ReviewSection
