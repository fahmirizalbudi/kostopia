"use client"

import Button from "@/app/components/ui/Button"
import styles from "./RentalList.module.scss"
import { Rental } from "@/app/types/rental"
import { useRouter } from "next/navigation"
import { snapMidtrans } from "@/app/data-access/transactions"
import { useSession } from "next-auth/react"
import { Transaction } from "@/app/types/transaction"

type PayButtonProps = {
  transactionStatus: string
  transactionMethod: string
  rental: Rental
}

const PayButton = ({ rental, transactionStatus, transactionMethod }: PayButtonProps) => {
  const router = useRouter()
  const session = useSession()
  const redirectPath = `/rentals/${rental.id}/transaction`

  const handleClick = async () => {
    console.log({transactionMethod, transactionStatus})
    if (transactionStatus === "no_transaction") {
      router.push(redirectPath)
    } else if (transactionStatus === "pending") {
      const transaction: Transaction = {
        rental_id: Number(rental.id),
      }
      if (transactionMethod === "ewallet") {
        const snap = await snapMidtrans({
          accessToken: String(session.data?.accessToken),
          schema: transaction,
        })

        const redirect: string = snap.redirect_url
        router.push(redirect)
      }
    }
  }

  return (
    <Button className={styles.payButton} onClick={handleClick}>
      Bayar ➝
    </Button>
  )
}

export default PayButton
