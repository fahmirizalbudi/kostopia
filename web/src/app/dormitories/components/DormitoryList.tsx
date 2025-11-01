"use client"

import Flex from "@/app/components/layout/Flex"
import styles from "./DormitoryList.module.scss"
import Image from "next/image"
import { Dormitory } from "@/app/types/dormitory"
import { asset } from "@/app/lib/asset"
import Link from "@/app/components/ui/Link"

const DormitoryList = (dormitoriesWithPreview: Dormitory) => {
  return (
    <Flex className={styles.dormitory}>
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
          <Link href={`/dormitories/${dormitoriesWithPreview.id}/detail`} className={styles.viewDetail}>Lihat Detail</Link>
        </div>
      </div>
    </Flex>
  )
}

export default DormitoryList
