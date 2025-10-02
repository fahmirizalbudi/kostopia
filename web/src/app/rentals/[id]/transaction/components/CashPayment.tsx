"use client"

import Button from "@/app/components/ui/Button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Modal } from "@/app/components/ui/Modal"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { createTransaction } from "@/app/data-access/transactions"
import { Transaction } from "@/app/types/transaction"
import { Rental } from "@/app/types/rental"
import nProgress from "nprogress"
import FormAction from "@/app/components/forms/FormAction"
import { NULL_PROOF } from "@/app/enums/transaction.enums"

type CashPaymentProps = {
  btnSytle: string
  rental: Rental
  renewal?: Boolean
  monthPaid?: number
}

const CashPayment = ({ btnSytle, rental, renewal, monthPaid }: CashPaymentProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)

  const toggleOpen = () => {
    return setIsOpen(!isOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const transaction: Transaction = {
      rental_id: Number(rental.id),
      month_paid: renewal ? monthPaid : Number(rental?.duration_months),
      purpose: renewal ? "renewal" : "new",
      method: "cash",
      status: "pending",
      proof: NULL_PROOF,
    }

    const res = await createTransaction({
      accessToken: String(session?.accessToken),
      schema: transaction,
    })

    if (!res.ok) {
      toast.error("Gagal membuat transaksi.")
      return
    }

    toast.success("Transaksi cash berhasil dibuat.")
    nProgress.start()

    setTimeout(() => {
      router.push("/rentals")
    }, 2000)
  }

  return (
    <div>
      <Button onClick={toggleOpen} className={btnSytle}>
        Bayar Sekarang!
      </Button>

      {isOpen && (
        <Modal title="Konfirmasi Pembayaran Tunai" isOpen={isOpen} onClose={toggleOpen}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p>
              Silakan lakukan pembayaran secara langsung kepada pemilik kos. Transaksi akan berstatus <b>Menunggu (pending)</b> sampai admin mengonfirmasi.
            </p>

            <FormAction onCancel={toggleOpen} />
          </form>
        </Modal>
      )}
    </div>
  )
}

export default CashPayment
