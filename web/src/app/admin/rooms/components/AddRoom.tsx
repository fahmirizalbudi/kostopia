"use client"

import Button from "@/app/components/ui/Button"
import { Room } from "@/app/types/room"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import formStyles from "@/app/components/forms/Action.module.scss"
import ComboBox, { Option } from "@/app/components/forms/ComboBox"
import { fetchDormitories } from "@/app/data-access/dormitories"
import { Dormitory } from "@/app/types/dormitory"
import { Modal } from "@/app/components/ui/Modal"
import Flex from "@/app/components/layout/Flex"
import Label from "@/app/components/forms/Label"
import TextBox from "@/app/components/forms/TextBox"
import { findOption } from "@/app/utils/utils"
import Error from "@/app/components/forms/Error"
import FormAction from "@/app/components/forms/FormAction"
import { createRoom } from "@/app/data-access/rooms"
import toast from "react-hot-toast"

const AddRoom = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const [formData, setFormData] = useState<Room>({ dormitory_id: null, room_number: "", status: "" })
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
    setFormData({ dormitory_id: null, room_number: "", status: "" })
    setErrors({ dormitory_id: null, room_number: "", status: "" })
    return setIsOpen(!isOpen)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await createRoom({
      accessToken: String(session?.accessToken),
      schema: formData
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
    toast.success("Kamar berhasil ditambahkan!", { duration: 3000 })
    router.refresh()
  }

  const roomStatus: Option[] = [
    { value: "available", label: "Tersedia" },
    { value: "rented", label: "Disewa" },
  ]

  return (
    <>
      <Button className={formStyles.add} onClick={toggleOpen}>
        Tambah Kamar
      </Button>
      <Modal title="Tambah Kamar" isOpen={isOpen} onClose={toggleOpen}>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <Flex className={formStyles.group}>
            <Label htmlFor="dormitory_id">Kost :</Label>
            <ComboBox
              options={dormitories}
              placeholder="Pilih kost ..."
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

export default AddRoom
