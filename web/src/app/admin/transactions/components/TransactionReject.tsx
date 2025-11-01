"use client"

import Action from "@/app/components/forms/Action"
import FormAction from "@/app/components/forms/FormAction"
import { Modal } from "@/app/components/ui/Modal"
import { changeTransactionStatus } from "@/app/data-access/transactions"
import { asset } from "@/app/lib/asset"
import { Transaction } from "@/app/types/transaction"
import { useRouter } from "next/navigation"
import nProgress from "nprogress"
import { useState } from "react"
import toast from "react-hot-toast"

const TransactionReject = (transaction: Transaction) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleSubmit = async () => {
    const res = await changeTransactionStatus({
      where: String(transaction.id),
      to: "rejected",
    })

    toast.success("Pembayaran telah ditolak.")
    nProgress.start()

    setTimeout(() => {
      router.refresh()
    }, 3000)
  }

  return (
    <>
      <Action icon={asset("stop.svg")} size={18} as="Tolak Pembayaran" onAction={toggleOpen} />
      {isOpen && (
        <Modal title="Tolak Pembayaran" isOpen={isOpen} onClose={toggleOpen}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p>
              Dengan mengonfirmasi, status transaksi akan berubah menjadi <b>Ditolak</b>. Pastikan periksa pembayaran dengan teliti dan seksama.
            </p>

            <FormAction onCancel={toggleOpen} />
          </form>
        </Modal>
      )}
    </>
  )
}

export default TransactionReject
