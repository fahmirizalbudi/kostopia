"use client"

import { useState } from "react"
import formStyles from "@/app/components/forms/Action.module.scss"
import { Modal } from "@/app/components/ui/Modal"
import FormAction from "@/app/components/forms/FormAction"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import Action from "@/app/components/forms/Action"
import { asset } from "@/app/lib/asset"
import { deleteDormitoryPreviews } from "@/app/data-access/dormitory-previews"
import { DormitoryPreview } from "@/app/types/dormitory-preview"

const DeleteDormitoryPreview = (dormitoryPreview: DormitoryPreview) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const { data: session } = useSession()

  const toggleOpen = () => {
    return setIsOpen(!isOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await deleteDormitoryPreviews({
      accessToken: String(session?.accessToken),
      where: Number(dormitoryPreview.id),
    })

    if (!res.ok) {
      return toast.error("Terjadi kesalahan!", { duration: 3000 })
    }

    setIsOpen(false)
    toast.success("Kost preview berhasil dihapus!", { duration: 3000 })
    router.refresh()
  }

  return (
    <>
      <Action icon={asset("hapus.svg")} size={18} as="Hapus" onAction={toggleOpen} />
      <Modal title="Hapus Kost Preview" isOpen={isOpen} onClose={toggleOpen}>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <FormAction onCancel={toggleOpen} />
        </form>
      </Modal>
    </>
  )
}

export default DeleteDormitoryPreview
