"use client"

import { useState } from "react"
import formStyles from "@/app/components/forms/Action.module.scss"
import { Modal } from "@/app/components/ui/Modal"
import TextBox from "@/app/components/forms/TextBox"
import Flex from "@/app/components/layout/Flex"
import Label from "@/app/components/forms/Label"
import ComboBox, { Option } from "@/app/components/forms/ComboBox"
import FormAction from "@/app/components/forms/FormAction"
import { findOption } from "@/app/utils/utils"
import { User } from "@/app/types/user"
import Error from "@/app/components/forms/Error"
import { API_URL } from "@/app/constants/api"
import { useRouter } from "next/navigation"
import Action from "@/app/components/forms/Action"
import { asset } from "@/app/lib/asset"
import toast from "react-hot-toast"

const DeleteUser = (user: User) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)

  const toggleOpen = () => {
    return setIsOpen(!isOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch(API_URL + `/users/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    setIsOpen(false)
    toast.success("User berhasil dihapus!", { duration: 3000 });
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
