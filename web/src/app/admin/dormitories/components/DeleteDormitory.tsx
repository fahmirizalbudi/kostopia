"use client"

import { useState } from "react"
import formStyles from "@/app/components/forms/Action.module.scss"
import { Modal } from "@/app/components/ui/Modal"
import FormAction from "@/app/components/forms/FormAction"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { Dormitory } from "@/app/types/dormitory"
import { deleteDormitory } from "@/app/data-access/dormitories"
import Action from "@/app/components/forms/Action"
import { asset } from "@/app/lib/asset"

const DeleteDormitory = (dormitory: Dormitory) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const { data: session } = useSession()

  const toggleOpen = () => {
    return setIsOpen(!isOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await deleteDormitory({
      accessToken: session?.accessToken as string,
      where: dormitory.id as number,
    })
    const json = await res.json()

    if (!res.ok) {
      return toast.error("Terjadi kesalahan!", { duration: 3000 })
    }

    setIsOpen(false)
    toast.success("Kos berhasil dihapus!", { duration: 3000 })
    router.refresh()
  }

  return (
    <>
      <Action icon={asset("hapus.svg")} size={18} as="Hapus" onAction={toggleOpen} />
      <Modal title="Hapus Kos" isOpen={isOpen} onClose={toggleOpen}>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <FormAction onCancel={toggleOpen} />
        </form>
      </Modal>
    </>
  )
}

export default DeleteDormitory
