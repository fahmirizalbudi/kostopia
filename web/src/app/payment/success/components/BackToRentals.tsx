"use client"

import Button from "@/app/components/ui/Button"
import styles from "../page.module.scss"
import { useRouter } from "next/navigation"

const BackToRentals = () => {
  const router = useRouter()

  const handleClick = () => router.push("/rentals")

  return (
    <Button onClick={handleClick} className={styles.button}>Kembali ke Rental</Button>
  )
}

export default BackToRentals