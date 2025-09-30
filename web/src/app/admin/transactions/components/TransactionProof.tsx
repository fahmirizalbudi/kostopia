"use client"

import Action from "@/app/components/forms/Action"
import { asset } from "@/app/lib/asset"
import { Transaction } from "@/app/types/transaction"
import { useRouter } from "next/navigation"

const TransactionProof = (transaction: Transaction) => {
  const router = useRouter()

  const toggleOpen = () => router.push(transaction.proof as string)

  return <Action icon={asset("upload_02.svg")} size={18} as="Edit" onAction={toggleOpen} />
}

export default TransactionProof
