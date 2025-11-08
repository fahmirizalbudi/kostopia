import Flex from "@/app/components/layout/Flex"
import styles from "./RentalList.module.scss"
import Image from "next/image"
import { Rental } from "@/app/types/rental"
import { findRoom } from "@/app/data-access/rooms"
import { findDormitory } from "@/app/data-access/dormitories"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option"
import { fetchDormitoryPreviews } from "@/app/data-access/dormitory-previews"
import { getTransactionMethodByRental, getTransactionStatusByRental } from "@/app/data-access/transactions"
import PayButton from "./PayButton"
import RenewalButton from "./RenewalButton"
import Review from "./Review"
import { getReviewsByDormitory } from "@/app/data-access/reviews"

const RentalList = async (rental: Rental) => {
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
  const transactionStatus = await getTransactionStatusByRental({
    where: Number(rental.id),
  })
  const reviews = await getReviewsByDormitory({
    where: Number(room.dormitory_id),
  })
  const hasReviewForRental = reviews?.some((r) => r.rental_id === rental.id)

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
                  Mulai Sewa:{" "}
                  <span className={styles.specificationBody}>
                    {new Date(rental.start_date as string).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </li>
              <li className={styles.rentalSpecification}>
                <span className={styles.specificationTitle}>
                  Lama Sewa: <span className={styles.specificationBody}>{rental.duration_months} Bulan</span>
                </span>
              </li>
              <li className={styles.rentalSpecification}>
                <span className={styles.specificationTitle}>
                  Selesai Sewa:{" "}
                  <span className={styles.specificationBody}>
                    {new Date(rental.end_date as string).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </li>
              <li className={styles.rentalSpecification}>
                <span className={styles.specificationTitle}>
                  Status:{" "}
                  <span
                    className={`${styles.specificationBody} ${
                      rental.status === "pending"
                        ? styles.statusPending
                        : rental.status === "active" || rental.status === "finished"
                        ? styles.statusPaid
                        : styles.statusCanceled
                    }`}
                  >
                    {rental.status === "pending"
                      ? "Menunggu"
                      : rental.status === "active"
                      ? "Aktif"
                      : rental.status === "finished"
                      ? "Selesai"
                      : "Dibatalkan"}
                  </span>
                </span>
              </li>
              <li className={styles.rentalSpecification}>
                <span className={styles.specificationTitle}>
                  Status Pembayaran:{" "}
                  <span
                    className={`${styles.specificationBody} ${
                      transactionStatus === "pending"
                        ? styles.statusPending
                        : transactionStatus === "success"
                        ? styles.statusPaid
                        : transactionStatus === "rejected"
                        ? styles.statusCanceled
                        : ""
                    }`}
                  >
                    {transactionStatus === "no_transaction"
                      ? "-"
                      : transactionStatus === "success"
                      ? "Lunas"
                      : transactionStatus === "rejected"
                      ? "Ditolak"
                      : "Menunggu"}
                  </span>
                </span>
              </li>
            </ul>
          </Flex>
        </Flex>
        <div className={styles.rentalAction}>
          {transactionStatus === "no_transaction" && rental.status === "pending" && <PayButton rental={rental} />}
          {rental.status === "active" && <RenewalButton {...rental} />}
          {rental.status === "finished" && !hasReviewForRental && <Review {...rental} />}
        </div>
      </Flex>
      <hr className={styles.lineDivider} />
    </>
  )
}

export default RentalList
