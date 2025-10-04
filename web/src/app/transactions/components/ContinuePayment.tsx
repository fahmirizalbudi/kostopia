"use client"

import { Transaction } from "@/app/types/transaction"
import styles from "./ContinuePayment.module.scss"
import { useEffect, useState } from "react"
import { snapMidtransCache } from "@/app/data-access/transactions"
import { useSession } from "next-auth/react"
import Button from "@/app/components/ui/Button"
import { useRouter } from "next/navigation"

const ContinuePayment = (transaction: Transaction) => {
  const router = useRouter()
  const session = useSession()
  const [redirect, setRedirect] = useState<String>()

  useEffect(() => {
    const getCache = async () => {
      const snap = await snapMidtransCache({
        accessToken: session.data?.accessToken as string,
        where: transaction.id as string,
      })
      if (snap.redirect_url) {
        setRedirect(snap?.redirect_url || null)
      }
    }
    getCache()
  }, [])

  const handleSubmit = () => window.open(redirect as string, "_blank")

  return (
    <>
      {redirect && (
        <Button className={styles.continuePayment} onClick={handleSubmit}>
          Lanjutkan ➝
        </Button>
      )}
    </>
  )
}

export default ContinuePayment
