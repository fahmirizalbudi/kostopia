import Flex from "@/app/components/layout/Flex"
import styles from "../page.module.scss"
import Rent from "./Rent"
import RatingReview from "@/app/components/ui/RatingReview"
import Image from "next/image"
import { asset } from "@/app/lib/asset"
import { Dormitory } from "@/app/types/dormitory"
import { getReviewsByDormitory } from "@/app/data-access/reviews"

const RightSection = async (dormitoryDetail: Dormitory) => {
  const reviews = await getReviewsByDormitory({
    where: dormitoryDetail.id as number,
  })
  const reviewer = reviews?.length ?? 0
  const averageOfRating = reviewer === 0 ? 0 : Math.round((reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviewer) * 10) / 10

  return (
    <Flex className={styles.rightSection}>
      <Flex className={styles.rightCard}>
        <div className={styles.content}>
          <div className={styles.description}>
            <span className={styles.name}>{dormitoryDetail.name}</span>
            <Flex className={styles.ratingSection}>
              <span className={styles.rentBadge}>For Rent</span>
              <Flex gap={16}>
                <RatingReview rating={averageOfRating} size={20} className={styles.ratingStar} />
                <span className={styles.reviewCount}>({reviewer} Reviews)</span>
              </Flex>
            </Flex>
            <div className={styles.location}>
              <Image src={asset("location.svg")} width={24} height={24} alt="Location" />
              <span className={styles.locationName}>{dormitoryDetail.address}</span>
            </div>
          </div>
          <div className={styles.pricing}>
            <div className={styles.price}>
              <span className={styles.priceHolder}>{dormitoryDetail.price?.toLocaleString("id-ID")}</span>
              <span className={styles.monthly}>
                <span className={styles.monthlyText}>/ Bulan</span>
              </span>
            </div>
          </div>
        </div>
        <Rent />
      </Flex>
    </Flex>
  )
}

export default RightSection
