"use client"

import { useEffect, useState } from "react"
import styles from "./PaymentMethod.module.scss"
import Button from "@/app/components/ui/Button"
import Flex from "@/app/components/layout/Flex"
import { createTransaction, snapMidtrans } from "@/app/data-access/transactions"
import { useSession } from "next-auth/react"
import { Transaction } from "@/app/types/transaction"
import { Rental } from "@/app/types/rental"
import { findRental } from "@/app/data-access/rentals"
import { useParams, useRouter } from "next/navigation"
import { NULL_PROOF } from "@/app/enums/transaction.enums"
import AttachProof from "./AttachProof"
import CashPayment from "./CashPayment"

const methods = [
  {
    id: "cash",
    label: "Cash",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
  },
  {
    id: "transfer",
    label: "Transfer",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 17l6-6-6-6"></path>
        <path d="M20 7v10"></path>
      </svg>
    ),
  },
  {
    id: "ewallet",
    label: "E-Wallet",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2"></rect>
        <path d="M15 9h3"></path>
      </svg>
    ),
  },
]

export default function PaymentMethod() {
  const [selected, setSelected] = useState("")
  const session = useSession()
  const { id } = useParams()
  const [rental, setRental] = useState<Rental>()
  const router = useRouter()

  useEffect(() => {
    const fetchRental = async () => {
      const rental = await findRental({
        where: Number(id),
      })
      setRental(rental)
    }
    fetchRental()
  }, [])

  const handlePay = async () => {
    const transaction: Transaction = {
      rental_id: Number(id),
      month_paid: Number(rental?.duration_months),
      purpose: "new",
      method: selected,
      status: "pending",
      proof: NULL_PROOF,
    }

    if (transaction.method === "ewallet") {
      const snapRes = await snapMidtrans({
        accessToken: String(session.data?.accessToken),
        schema: transaction,
      })

      transaction.proof = String(snapRes.midtrans_unique)

      const transactionRes = await createTransaction({
        accessToken: String(session.data?.accessToken),
        schema: transaction,
      })

      if (transactionRes) {
        const redirect: string = snapRes.snap_response.redirect_url
        router.push(redirect)
      }
    } else if (transaction.method === "transfer") {
      console.log("tes")
    }
  }

  return (
    <>
      <div className={styles.container}>
        {methods.map((method) => (
          <label key={method.id} className={`${styles.option} ${selected === method.id ? styles.active : ""}`}>
            <input type="radio" name="method" value={method.id} checked={selected === method.id} onChange={() => setSelected(method.id)} />
            <span className={styles.customRadio}></span>
            <span className={styles.icon}>{method.icon}</span>
            <span className={styles.label}>{method.label}</span>
          </label>
        ))}
        <Flex className={styles.payWrapper}>
          {selected === "ewallet" && (
            <Button className={styles.pay} onClick={handlePay}>
              Bayar Sekarang!
            </Button>
          )}

          {selected === "transfer" && <AttachProof rental={rental as Rental} btnSytle={styles.pay} />}

          {selected === "cash" && <CashPayment rental={rental as Rental} btnSytle={styles.pay} />}

          {selected === "" && (
            <Button className={`${styles.pay} ${styles.inactive}`}>
              Bayar Sekarang!
            </Button>
          )}
        </Flex>
      </div>
    </>
  )
}
