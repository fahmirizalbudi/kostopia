import Flex from "@/app/components/layout/Flex"
import styles from "./TransactionList.module.scss"
import Image from "next/image"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Transaction } from "@/app/types/transaction"
import { findRoom } from "@/app/data-access/rooms"
import { findDormitory } from "@/app/data-access/dormitories"
import { fetchDormitoryPreviews } from "@/app/data-access/dormitory-previews"
import { findRental } from "@/app/data-access/rentals"
import TransactionReceipt from "@/app/admin/transactions/components/TransactionReceipt"

const TransactionList = async (transaction: Transaction) => {
  const session = await getServerSession(authOptions)
  const rental = await findRental({
    where: Number(transaction.rental_id),
  })
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
      <Flex className={styles.transaction}>
        <Image src={String(dormitoryPreview[0].url)} height={110} width={110} alt="Rental" className={styles.transactionImage} />
        <Flex className={styles.transactionContent}>
          <Flex className={styles.transactionContentWrapper}>
            <span className={styles.transactionName}>
              {transaction.id} - Rp. {transaction.amount?.toLocaleString("id-ID")}
            </span>
            <ul className={styles.transactionSpecifications}>
              <li className={styles.transactionSpecification}>
                <span className={styles.specificationTitle}>
                  Kos: <span className={styles.specificationBody}>{dormitory.name}</span>
                </span>
              </li>
              <li className={styles.transactionSpecification}>
                <span className={styles.specificationTitle}>
                  Kamar: <span className={styles.specificationBody}>{room.room_number}</span>
                </span>
              </li>
              <li className={styles.transactionSpecification}>
                <span className={styles.specificationTitle}>
                  Keperluan: <span className={styles.purpose}>{transaction.purpose === "new" ? "Sewa Baru" : "Perpanjang Sewa"}</span>
                </span>
              </li>
              <li className={styles.transactionSpecification}>
                <span className={styles.specificationTitle}>
                  Metode:{" "}
                  <span className={styles.paymentMethod}>
                    {transaction.method === "ewallet" ? "E-Wallet" : transaction.method === "transfer" ? "Transfer" : "Cash"}
                  </span>
                </span>
              </li>
              <li className={styles.transactionSpecification}>
                <span className={styles.specificationTitle}>
                  Status:{" "}
                  <span
                    className={`${styles.specificationBody} ${
                      transaction.status === "pending"
                        ? styles.statusPending
                        : transaction.status === "success"
                        ? styles.statusPaid
                        : transaction.status === "rejected"
                        ? styles.statusCanceled
                        : ""
                    }`}
                  >
                    {transaction.status === "no_transaction"
                      ? "-"
                      : transaction.status === "success"
                      ? "Lunas"
                      : transaction.status === "rejected"
                      ? "Ditolak"
                      : "Menunggu"}
                  </span>
                </span>
              </li>
            </ul>
          </Flex>
        </Flex>
        <div className={styles.transactionAction}>{transaction.status === "success" && <TransactionReceipt {...transaction} />}</div>
      </Flex>
      <hr className={styles.lineDivider} />
    </>
  )
}

export default TransactionList
