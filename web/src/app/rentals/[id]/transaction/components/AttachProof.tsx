"use client"

import Button from "@/app/components/ui/Button"
import formStyles from "@/app/components/forms/Action.module.scss"
import Flex from "@/app/components/layout/Flex"
import Label from "@/app/components/forms/Label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Modal } from "@/app/components/ui/Modal"
import FormAction from "@/app/components/forms/FormAction"
import FileDialog from "@/app/components/forms/FileDialog"
import Error from "@/app/components/forms/Error"
import { useSession } from "next-auth/react"
import { attachProof, createTransaction } from "@/app/data-access/transactions"
import { Transaction } from "@/app/types/transaction"
import { NULL_PROOF } from "@/app/enums/transaction.enums"
import { Rental } from "@/app/types/rental"
import nProgress from "nprogress"

type AttachProofProps = {
  btnSytle: string
  rental: Rental
  renewal?: Boolean
  monthPaid?: number
}

const AttachProof = ({ btnSytle, rental, renewal, monthPaid }: AttachProofProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>("")

  const toggleOpen = () => {
    setFile(null)
    setError("")
    return setIsOpen(!isOpen)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    file && formData.append("proof", file)

    const transaction: Transaction = {
      rental_id: Number(rental.id),
      month_paid: renewal ? monthPaid : Number(rental?.duration_months),
      purpose: renewal ? "renewal" : "new",
      method: "transfer",
      status: "pending",
      proof: NULL_PROOF,
    }

    const transactionRes = await createTransaction({
      accessToken: String(session?.accessToken),
      schema: transaction,
    })

    const json = await transactionRes.json()

    const attachRes = await attachProof({
      accessToken: String(session?.accessToken),
      schema: formData,
      where: String(json.data.id),
    })

    if (attachRes) {
      console.log(attachRes)
      nProgress.start()
      setTimeout(() => {
        router.push("/rentals")
      }, 3000)
    }
  }

  return (
    <div>
      <Button onClick={toggleOpen} className={btnSytle}>
        Bayar Sekarang!
      </Button>
      {isOpen && (
        <Modal title="Unggah Bukti" isOpen={isOpen} onClose={toggleOpen}>
          <form className={formStyles.form} onSubmit={handleSubmit}>
            <Flex className={formStyles.group}>
              <Label htmlFor="name">Bukti Transfer :</Label>
              <FileDialog name="proof" placeholder="Masukkan bukti ..." selectedFile={file?.name} onChange={handleFileChange} />
              <Error error={error} />
            </Flex>
            <FormAction onCancel={toggleOpen} />
          </form>
        </Modal>
      )}
    </div>
  )
}

export default AttachProof
