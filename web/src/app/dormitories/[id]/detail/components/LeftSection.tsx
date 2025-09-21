import Flex from "@/app/components/layout/Flex"
import styles from "../page.module.scss"
import Facility from "./Facility"
import { Dormitory } from "@/app/types/dormitory"
import Link from "next/link"

const LeftSection = (dormitoryDetail: Dormitory) => {
  return (
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
          <Link className={styles.seeMap} href={String(dormitoryDetail.google_maps)}>
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
  )
}

export default LeftSection
