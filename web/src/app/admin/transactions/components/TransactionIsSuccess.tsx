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

const TransactionIsSuccess = (transaction: Transaction) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleSubmit = async () => {
    const res = await changeTransactionStatus({
      where: String(transaction.id),
      to: "success",
    })

    toast.success("Pembayaran telah dikonfirmasi.")
    nProgress.start()

    setTimeout(() => {
      router.refresh()
    }, 3000)
  }

  return (
    <>
      <Action icon={asset("check.svg")} size={18} as="Edit" onAction={toggleOpen} />
      {isOpen && (
        <Modal title="Konfirmasi Pembayaran" isOpen={isOpen} onClose={toggleOpen}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p>
              Dengan mengonfirmasi, status transaksi akan berubah menjadi <b>Lunas</b>. Pastikan pembayaran telah diterima dari penyewa.
            </p>

            <FormAction onCancel={toggleOpen} />
          </form>
        </Modal>
      )}
    </>
  )
}

export default TransactionIsSuccess
