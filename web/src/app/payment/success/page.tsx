"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { changeTransactionStatus } from "@/app/data-access/transactions"
import BackToRentals from "./components/BackToRentals"
import styles from "./page.module.scss"

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const transaction_status = searchParams.get("transaction_status")

  useEffect(() => {
    const changeStatus = async () => {
      await changeTransactionStatus({
        where: String(id),
        to: transaction_status === "settlement" ? "success" : "pending",
      })
    }
    changeStatus()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <h1 className={styles.title}>Pembayaran Berhasil</h1>

        {id && <p className={styles.id}>ID Transaksi: {id}</p>}

        <BackToRentals />
      </div>
    </div>
  )
}
