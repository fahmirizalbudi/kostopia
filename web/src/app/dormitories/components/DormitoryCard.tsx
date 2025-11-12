"use client"

import Image from "next/image"
import styles from "./DormitoryCard.module.scss"
import { asset } from "@/app/lib/asset"
import { Dormitory } from "@/app/types/dormitory"
import Link from "@/app/components/ui/Link"
import { getReviewsByDormitory } from "@/app/data-access/reviews"
import { useEffect, useState } from "react"
import { Review } from "@/app/types/review"

const DormitoryCard = (dormitoriesWithPreview: Dormitory) => {
  const [reviews, setReviews] = useState<Review[]>()

  useEffect(() => {
    const fetchReviews = async () => {
      const reviews = await getReviewsByDormitory({
        where: dormitoriesWithPreview.id as number,
      })
      setReviews(reviews)
    }
    fetchReviews()
  })

  const reviewer = reviews?.length ?? 0
  const averageOfRating = reviewer === 0 ? 0 : Math.round((reviews!.reduce((sum, r) => sum + Number(r.rating), 0) / reviewer) * 10) / 10

  return (
    <div className={styles.dormitory}>
      <div className={styles.ratingOverview}>
        <span className={styles.ratingText}>{averageOfRating} / 5 ⭐</span>
      </div>
      <div className={styles.dormitoryPreviewWrapper}>
        <Image
          src={dormitoriesWithPreview?.previews ? String(dormitoriesWithPreview?.previews[0]?.url) : asset("preview.png")}
          alt="Preview"
          fill
          className={styles.dormitoryPreview}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.description}>
          <span className={styles.name}>{dormitoriesWithPreview.name}</span>
          <div className={styles.location}>
            <Image src={asset("location.svg")} width={24} height={24} alt="Location" />
            <span className={styles.locationName}>{dormitoriesWithPreview.address}</span>
          </div>
          <ul className={styles.facilities}>
            {dormitoriesWithPreview.facilities
              ?.split(",")
              .slice(0, 3)
              .map((facility) => (
                <li className={styles.facility} key={facility}>
                  {facility}
                </li>
              ))}
          </ul>
        </div>
        <div className={styles.pricing}>
          <div className={styles.price}>
            <span className={styles.priceHolder}>{dormitoriesWithPreview.price?.toLocaleString("id-ID")}</span>
            <span className={styles.monthly}>
              <span className={styles.monthlyText}>/ Bulan</span>
            </span>
          </div>
          <Link href={`/dormitories/${dormitoriesWithPreview.id}/detail`} className={styles.viewDetail}>
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DormitoryCard
