"use client"

import { useState } from "react"
import formStyles from "@/app/components/forms/Action.module.scss"
import { Modal } from "@/app/components/ui/Modal"
import FormAction from "@/app/components/forms/FormAction"
import { User } from "@/app/types/user"
import { useRouter } from "next/navigation"
import Action from "@/app/components/forms/Action"
import { asset } from "@/app/lib/asset"
import toast from "react-hot-toast"
import { deleteUser } from "@/app/data-access/users"
import { useSession } from "next-auth/react"

const DeleteUser = (user: User) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const { data: session } = useSession()

  const toggleOpen = () => {
    return setIsOpen(!isOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await deleteUser({
      accessToken: session?.accessToken as string,
      where: user.id as number,
    })

    if (!res.ok) {
      return toast.error("Terjadi kesalahan!", { duration: 3000 })
    }

    setIsOpen(false)
    toast.success("User berhasil dihapus!", { duration: 3000 })
    router.refresh()
  }

  return (
    <>
      <Action icon={asset("hapus.svg")} size={18} as="Hapus" onAction={toggleOpen} />
      <Modal title="Hapus Pengguna" isOpen={isOpen} onClose={toggleOpen}>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <FormAction onCancel={toggleOpen} />
        </form>
      </Modal>
    </>
  )
}

export default DeleteUser
