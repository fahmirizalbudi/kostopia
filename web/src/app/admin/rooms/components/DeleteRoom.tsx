"use client"

import { Modal } from "@/app/components/ui/Modal"
import { deleteRoom } from "@/app/data-access/rooms"
import { Room } from "@/app/types/room"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import formStyles from "@/app/components/forms/Action.module.scss"
import FormAction from "@/app/components/forms/FormAction"
import Action from "@/app/components/forms/Action"
import { asset } from "@/app/lib/asset"

const DeleteRoom = (room: Room) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const { data: session } = useSession()

  const toggleOpen = () => {
    return setIsOpen(!isOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await deleteRoom({
      accessToken: session?.accessToken as string,
      where: Number(room.id),
    })

    if (!res.ok) {
      return toast.error("Terjadi kesalahan!", { duration: 3000 })
    }

    setIsOpen(false)
    toast.success("Kamar berhasil dihapus!", { duration: 3000 })
    router.refresh()
  }

  return (
    <>
      <Action icon={asset("hapus.svg")} size={18} as="Hapus" onAction={toggleOpen} />
      <Modal title="Hapus Kamar" isOpen={isOpen} onClose={toggleOpen}>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <FormAction onCancel={toggleOpen} />
        </form>
      </Modal>
    </>
  )
}

export default DeleteRoom