"use client"

import Button from "@/app/components/ui/Button"
import styles from "./RentalList.module.scss"
import { Rental } from "@/app/types/rental"
import { useRouter } from "next/navigation"
import { snapMidtrans } from "@/app/data-access/transactions"
import { useSession } from "next-auth/react"
import { Transaction } from "@/app/types/transaction"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import nProgress from "nprogress"

type PayButtonProps = {
  transactionStatus: string
  transactionMethod: string
  rental: Rental
}

const PayButton = ({ rental, transactionStatus, transactionMethod }: PayButtonProps) => {
  const router = useRouter()
  const session = useSession()
  const redirectPath = `/rentals/${rental.id}/transaction`
  const [text, setText] = useState<String>("")

  useEffect(() => {
    setText("Bayar ➝")
    if (transactionStatus === "pending") {
      if (transactionMethod === "ewallet") {
        setText("Lanjutkan ke Midtrans ➝")
      } else {
        setText("ⓘ")
      }
    }
  }, [])

  const handleClick = async () => {
    console.log({ transactionMethod, transactionStatus })
    nProgress.start()
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
      } else if (transactionMethod === "transfer") {
        nProgress.done()
        toast("Bukti transfer sedang diperiksa.", {
          id: "transfer-pending",
          icon: "ℹ️",
        })
      } else if (transactionMethod === "cash") {
        nProgress.done()
        toast("Menunggu konfirmasi pemilik kos.", {
          id: "transfer-pending",
          icon: "ℹ️",
        })
      }
    }
  }

  return (
    <>
      {text !== "" && (
        <Button className={styles.payButton} onClick={handleClick}>
          {text}
        </Button>
      )}
    </>
  )
}

export default PayButton
