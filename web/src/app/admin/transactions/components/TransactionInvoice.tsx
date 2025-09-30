"use client"

import Action from "@/app/components/forms/Action"
import { asset } from "@/app/lib/asset"
import { Transaction } from "@/app/types/transaction"

const TransactionInvoice = (transaction: Transaction) => {
  const toggleOpen = () => console.log("Clicked")

  return <Action icon={asset("invoice.svg")} size={18} as="Edit" onAction={toggleOpen} />
}

export default TransactionInvoice
