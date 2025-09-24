"use client"

import { useState } from "react"
import styles from "./PaymentMethod.module.scss"
import Button from "@/app/components/ui/Button"
import Flex from "@/app/components/layout/Flex"

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

  return (
    <div className={styles.container}>
      {methods.map((method) => (
        <label key={method.id} className={`${styles.option} ${selected === method.id ? styles.active : ""}`}>
          <input type="radio" name="payment" value={method.id} checked={selected === method.id} onChange={() => setSelected(method.id)} />
          <span className={styles.customRadio}></span>
          <span className={styles.icon}>{method.icon}</span>
          <span className={styles.label}>{method.label}</span>
        </label>
      ))}
      <Flex className={styles.payWrapper}><Button className={styles.pay}>Bayar Sekarang!</Button></Flex>
    </div>
  )
}
