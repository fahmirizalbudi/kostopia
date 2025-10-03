"use client"

import Button from "@/app/components/ui/Button"
import styles from "./RentalList.module.scss"
import { Rental } from "@/app/types/rental"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import nProgress from "nprogress"

type PayButtonProps = {
  rental: Rental
}

const PayButton = ({ rental }: PayButtonProps) => {
  const router = useRouter()
  const redirectPath = `/rentals/${rental.id}/transaction`
  const [text, setText] = useState<String>("")

  useEffect(() => {
    setText("Bayar ➝")
  }, [])

  const handleClick = async () => {
    nProgress.start()
    router.push(redirectPath)
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
