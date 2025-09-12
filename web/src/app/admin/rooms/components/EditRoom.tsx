"use client"

import Action from "@/app/components/forms/Action"
import { Modal } from "@/app/components/ui/Modal"
import { asset } from "@/app/lib/asset"
import formStyles from "@/app/components/forms/Action.module.scss"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Room } from "@/app/types/room"
import { useSession } from "next-auth/react"
import ComboBox, { Option } from "@/app/components/forms/ComboBox"
import { Dormitory } from "@/app/types/dormitory"
import { fetchDormitories } from "@/app/data-access/dormitories"
import toast from "react-hot-toast"
import { updateRoom } from "@/app/data-access/rooms"
import Flex from "@/app/components/layout/Flex"
import Label from "@/app/components/forms/Label"
import Error from "@/app/components/forms/Error"
import { findOption } from "@/app/utils/utils"
import TextBox from "@/app/components/forms/TextBox"
import FormAction from "@/app/components/forms/FormAction"

const EditRoom = (room: Room) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const [formData, setFormData] = useState<Room>({ dormitory_id: room.dormitory_id, room_number: room.room_number, status: room.status })
  const [errors, setErrors] = useState<Room>({ dormitory_id: null, room_number: "", status: "" })
  const { data: session } = useSession()
  const [dormitories, setDormitories] = useState<Option[]>([])

  useEffect(() => {
      const fetchDormitoriesOption = async () => {
        const rawDormitories: Dormitory[] = await fetchDormitories()
        const optionDormitories: Option[] = rawDormitories.map(rawDormitory => ({
          value: String(rawDormitory?.id),
          label: String(rawDormitory?.id) + " - " + String(rawDormitory?.name)
        }))
        setDormitories(optionDormitories)
      }
  
      fetchDormitoriesOption()
    },[dormitories])

  const toggleOpen = () => {
    setFormData({ dormitory_id: room.dormitory_id, room_number: room.room_number, status: room.status })
    setErrors({ dormitory_id: null, room_number: "", status: "" })
    return setIsOpen(!isOpen)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await updateRoom({
      accessToken: String(session?.accessToken),
      schema: formData,
      where: Number(room.id)
    })
    const json = await res.json()

    if (res.status === 422) {
      const errs = json.data
      return setErrors(errs)
    }

    if (!res.ok) {
      return toast.error("Terjadi kesalahan!", { duration: 3000 })
    }

    setIsOpen(false)
    toast.success("Kamar berhasil diperbarui!", { duration: 3000 })
    router.refresh()
  }

  const roomStatus: Option[] = [
    { value: "available", label: "Tersedia" },
    { value: "rented", label: "Disewa" },
  ]

  return (
    <>
      <Action icon={asset("edit.svg")} size={18} as="Edit" onAction={toggleOpen} />
      <Modal title="Edit Kamar" isOpen={isOpen} onClose={toggleOpen}>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <Flex className={formStyles.group}>
            <Label htmlFor="dormitory_id">Kos :</Label>
            <ComboBox
              options={dormitories}
              placeholder="Pilih kos ..."
              value={findOption(dormitories, String(formData?.dormitory_id))}
              onChange={(option) => setFormData({ ...formData, dormitory_id: Number(option) })}
            />
            <Error error={errors?.dormitory_id ? String(errors.dormitory_id) : undefined} />
          </Flex>
          <Flex className={formStyles.group}>
            <Label htmlFor="room_number">Nomor Kamar :</Label>
            <TextBox name="room_number" type="text" value={formData.room_number} placeholder="Masukkan nomor kamar ..." onChange={handleChange} />
            <Error error={errors.room_number} />
          </Flex>
          <Flex className={formStyles.group}>
            <Label htmlFor="status">Status :</Label>
            <ComboBox
              options={roomStatus}
              placeholder="Pilih status ..."
              value={findOption(roomStatus, String(formData?.status))}
              onChange={(option) => setFormData({ ...formData, status: option })}
            />
            <Error error={errors.status} />
          </Flex>
          <FormAction onCancel={toggleOpen} />
        </form>
      </Modal>
    </>
  )
}

export default EditRoom
