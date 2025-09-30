"use client"

import Action from "@/app/components/forms/Action"
import { API } from "@/app/constants/api"
import { asset } from "@/app/lib/asset"
import { Transaction } from "@/app/types/transaction"
import { useRouter } from "next/navigation"
import nProgress from "nprogress"

const TransactionReceipt = (transaction: Transaction) => {
  const router = useRouter()

  const handleAction = () => {
    nProgress.start()
    router.push(`${API}/transactions/${transaction.id}/receipt`)
  }

  return <Action icon={asset("receipt.svg")} size={18} as="Edit" onAction={handleAction} />
}

export default TransactionReceipt
