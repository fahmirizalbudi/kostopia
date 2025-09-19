import NavigationBar from "@/app/components/layout/NavigationBar"
import { menuNavigationBar } from "@/app/menu/navigation-bar"
import styles from "./page.module.scss"
import Flex from "@/app/components/layout/Flex"
import { findDormitory } from "@/app/data-access/dormitories"
import { fetchDormitoryPreviews } from "@/app/data-access/dormitory-previews"
import RatingReview from "@/app/components/ui/RatingReview"
import { asset } from "@/app/lib/asset"
import Image from "next/image"
import Break from "@/app/admin/components/Break"
import Grid from "@/app/components/layout/Grid"
import Facility from "./components/Facility"
import Button from "@/app/components/ui/Button"
import Link from "next/link"

type DormitoryDetailProps = {
  params: { id: string }
}

const DormitoryDetail = async ({ params }: DormitoryDetailProps) => {
  const dormitoryDetail = await findDormitory({
    where: Number(params.id),
  })

  const dormitoryPreviews = await fetchDormitoryPreviews({
    where: Number(params.id),
  })

  return (
    <main>
      <NavigationBar menu={menuNavigationBar} />
      <section className={styles.container}>
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
        <Break height={30} />
        <Grid className={`${styles.carousels} ${dormitoryPreviews.length === 1 ? "" : dormitoryPreviews.length === 2 ? styles.two : styles.more}`}>
          {dormitoryPreviews[0] && (
            <div className={`${styles.carousel} ${dormitoryPreviews.length > 2 ? styles.carouselBig : ""}`}>
              <img src={dormitoryPreviews[0].url} alt="" />
            </div>
          )}

          {dormitoryPreviews[1] && (
            <div className={`${styles.carousel}`}>
              <img src={dormitoryPreviews[1].url} alt="" />
            </div>
          )}

          {dormitoryPreviews[2] && (
            <div className={`${styles.carousel} ${styles.smallTop}`}>
              <img src={dormitoryPreviews[2].url} alt="" />
            </div>
          )}

          {dormitoryPreviews.length >= 3 && (
            <div className={`${styles.carousel} ${styles.fullBottom}`}>
              <img src={dormitoryPreviews[3]?.url} alt="" />
              <span className={styles.overlay}>{dormitoryPreviews.length > 3 ? "+" + (dormitoryPreviews.length - 3) : "+0"}</span>
            </div>
          )}
        </Grid>
        <Flex className={styles.mainContent}>
          <Flex className={styles.leftSection}>
            <span className={styles.subContentTitle}>Informasi</span>
            <Flex className={styles.facilities}>
              {dormitoryDetail.facilities?.split(",").map((dormitoryDetail) => (
                <Facility text={dormitoryDetail} />
              ))}
            </Flex>
            <Flex className={styles.description}>
              <p>{dormitoryDetail.description}</p>
            </Flex>
            <Flex className={styles.mapLocation}>
              <Flex className={styles.mapLocationHeader}>
                <span className={styles.subContentTitle}>Petunjuk Arah</span>
                <Link className={styles.seeMap} href="#">
                  Buka Map
                </Link>
              </Flex>
              <iframe
                src={dormitoryDetail.google_maps}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={styles.googleMaps}
              ></iframe>
            </Flex>
          </Flex>
          <Flex className={styles.rightSection}>
            <Flex className={styles.rightCard}>
              <div className={styles.content}>
                <div className={styles.description}>
                  <span className={styles.name}>{dormitoryDetail.name}</span>
                  <Flex className={styles.ratingSection}>
                    <span className={styles.rentBadge}>For Rent</span>
                    <RatingReview rating={5} size={20} className={styles.ratingStar} />
                    <span className={styles.reviewCount}>(2 Reviews)</span>
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
              <Button className={styles.rentNow}>Sewa Sekarang!</Button>
            </Flex>
          </Flex>
        </Flex>
      </section>
    </main>
  )
}

export default DormitoryDetail
