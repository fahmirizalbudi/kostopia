import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option"
import Flex from "@/app/components/layout/Flex"
import { findDormitory } from "@/app/data-access/dormitories"
import { fetchDormitoryPreviews } from "@/app/data-access/dormitory-previews"
import { findRoom } from "@/app/data-access/rooms"
import { Rental } from "@/app/types/rental"
import { getServerSession } from "next-auth"
import Image from "next/image"
import styles from "./Summary.module.scss"

const Summary = async (rental: Rental) => {
  
  const session = await getServerSession(authOptions)
  const room = await findRoom({
    accessToken: String(session?.accessToken),
    where: Number(rental.room_id),
  })
  const dormitory = await findDormitory({
    where: Number(room.dormitory_id),
  })
  const dormitoryPreview = await fetchDormitoryPreviews({
    where: Number(dormitory.id),
  })

  return (
    <>
      <Flex className={styles.rental}>
        <Image src={String(dormitoryPreview[0].url)} height={110} width={110} alt="Rental" className={styles.rentalImage} />
        <Flex className={styles.rentalContent}>
          <Flex className={styles.rentalContentWrapper}>
            <span className={styles.rentalName}>
              {dormitory.name} - {room.room_number}
            </span>
            <ul className={styles.rentalSpecifications}>
              <li className={styles.rentalSpecification}>
                <span className={styles.specificationTitle}>
                  Mulai Sewa: <span className={styles.specificationBody}>{new Date(String(rental.start_date)).toLocaleDateString("id-ID")}</span>
                </span>
              </li>
              <li className={styles.rentalSpecification}>
                <span className={styles.specificationTitle}>
                  Lama Sewa: <span className={styles.specificationBody}>{rental.duration_months} Bulan</span>
                </span>
              </li>
            </ul>
          </Flex>
        </Flex>
        <Flex className={styles.priceWrapper}>
          <span className={styles.priceText}>Rp {(Number(dormitory.price) * Number(rental.duration_months)).toLocaleString("id-ID")}</span>
        </Flex>
      </Flex>
    </>
  )
}

export default Summary
