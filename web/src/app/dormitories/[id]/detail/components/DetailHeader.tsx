import Flex from "@/app/components/layout/Flex"
import styles from "../page.module.scss"
import RatingReview from "@/app/components/ui/RatingReview"
import Image from "next/image"
import { asset } from "@/app/lib/asset"
import { Dormitory } from "@/app/types/dormitory"

const DetailHeader = (dormitoryDetail: Dormitory) => {
  return (
    <Flex className={styles.header}>
      <Flex className={styles.leftSection}>
        <span className={styles.titleSection}>{dormitoryDetail.name}</span>
        <Flex className={styles.ratingSection}>
          <span className={styles.rentBadge}>For Rent</span>
          <RatingReview rating={5} size={20} className={styles.ratingStar} />
          <span className={styles.reviewCount}>(2 Reviews)</span>
        </Flex>
        <div className={styles.location}>
          <Image src={asset("location.svg")} width={24} height={24} alt="Location" />
          <span className={styles.locationName}>{dormitoryDetail.address}</span>
        </div>
      </Flex>
      <Flex className={styles.rightSection}>
        <div className={styles.price}>
          <span className={styles.priceHolder}>{dormitoryDetail.price?.toLocaleString("id-ID")}</span>
          <span className={styles.monthly}>
            <span className={styles.monthlyText}>/ Bulan</span>
          </span>
        </div>
      </Flex>
    </Flex>
  )
}

export default DetailHeader
