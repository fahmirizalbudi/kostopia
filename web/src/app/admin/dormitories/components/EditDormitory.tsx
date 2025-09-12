"use client"

import { useState } from "react"
import formStyles from "@/app/components/forms/Action.module.scss"
import { Modal } from "@/app/components/ui/Modal"
import TextBox from "@/app/components/forms/TextBox"
import Flex from "@/app/components/layout/Flex"
import Label from "@/app/components/forms/Label"
import FormAction from "@/app/components/forms/FormAction"
import Error from "@/app/components/forms/Error"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { Dormitory } from "@/app/types/dormitory"
import { updateDormitory } from "@/app/data-access/dormitories"
import Action from "@/app/components/forms/Action"
import { asset } from "@/app/lib/asset"

const EditDormitory = (dormitory: Dormitory) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const [formData, setFormData] = useState<Dormitory>({
    name: dormitory.name,
    address: dormitory.address,
    description: dormitory.description,
    price: dormitory.price,
    facilities: dormitory.facilities,
    google_maps: dormitory.google_maps,
  })
  const [errors, setErrors] = useState<Dormitory>({ name: "", address: "", description: "", price: null, facilities: "", google_maps: "" })
  const { data: session } = useSession()

  const toggleOpen = () => {
    setFormData({
      name: dormitory.name,
      address: dormitory.address,
      description: dormitory.description,
      price: dormitory.price,
      facilities: dormitory.facilities,
      google_maps: dormitory.google_maps,
    })
    setErrors({ name: "", address: "", description: "", price: null, facilities: "", google_maps: "" })
    return setIsOpen(!isOpen)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await updateDormitory({
      accessToken: session?.accessToken as string,
      schema: formData,
      where: dormitory.id as number,
    })
    const json = await res.json()

    if (res.status === 422) {
      const errs = json.data
      return setErrors(errs)
    }

    if (!res.ok) {
      return toast.error("Terjadi kesalahan!", { duration: 3000 })
    }

    setFormData({ name: "", address: "", description: "", price: null, facilities: "", google_maps: "" })

    setIsOpen(false)
    toast.success("Kos berhasil diperbarui!", { duration: 3000 })
    router.refresh()
  }

  return (
    <>
      <Action icon={asset("edit.svg")} size={18} as="Edit" onAction={toggleOpen} />
      <Modal title="Edit Kos" isOpen={isOpen} onClose={toggleOpen}>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <Flex className={formStyles.group}>
            <Label htmlFor="name">Nama :</Label>
            <TextBox name="name" type="text" value={formData.name} placeholder="Masukkan nama ..." onChange={handleChange} />
            <Error error={errors.name} />
          </Flex>
          <Flex className={formStyles.group}>
            <Label htmlFor="address">Alamat :</Label>
            <TextBox name="address" type="text" value={formData.address} placeholder="Masukkan alamat ..." onChange={handleChange} />
            <Error error={errors.address} />
          </Flex>
          <Flex className={formStyles.group}>
            <Label htmlFor="description">Deskripsi :</Label>
            <TextBox name="description" type="text" value={formData.description} placeholder="Masukkan deskripsi ..." onChange={handleChange} />
            <Error error={errors.description} />
          </Flex>
          <Flex className={formStyles.group}>
            <Label htmlFor="price">Harga :</Label>
            <TextBox
              name="price"
              type="number"
              value={(formData.price as number) ?? ""}
              placeholder="Masukkan harga ..."
              onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : "" })}
            />
            <Error error={errors.price as string} />
          </Flex>
          <Flex className={formStyles.group}>
            <Label htmlFor="facilities">Fasilitas :</Label>
            <TextBox name="facilities" type="text" value={formData.facilities} placeholder="Masukkan fasilitas ..." onChange={handleChange} />
            <Error error={errors.facilities} />
          </Flex>
          <Flex className={formStyles.group}>
            <Label htmlFor="google_maps">Google Map :</Label>
            <TextBox name="google_maps" type="text" value={formData.google_maps} placeholder="Masukkan [x, y] ..." onChange={handleChange} />
            <Error error={errors.google_maps} />
          </Flex>
          <FormAction onCancel={toggleOpen} />
        </form>
      </Modal>
    </>
  )
}

export default EditDormitory
