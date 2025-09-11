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
import { DormitoryPreview } from "@/app/types/dormitory-preview"
import { createDormitoryPreview } from "@/app/data-access/dormitory-previews"
import toast from "react-hot-toast"
import Error from "@/app/components/forms/Error"
import { useSession } from "next-auth/react"

const AddDormitoryPreview = (dormitoryPreview: DormitoryPreview) => {
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
    formData.append("dormitory_id", String(dormitoryPreview.id))
    file && formData.append("preview", file)

    const res = await createDormitoryPreview({
      accessToken: await String(session?.accessToken),
      schema: formData,
      where: Number(dormitoryPreview.dormitory_id),
    })
    const json = await res.json()

    if (res.status === 422) {
      const errs = json.data
      return setError(errs.preview)
    }

    if (!res.ok) {
      return toast.error("Terjadi kesalahan!", { duration: 3000 })
    }

    setIsOpen(false)
    toast.success("Preview berhasil ditambahkan!", { duration: 3000 })
    router.refresh()
  }

  return (
    <>
      <Button onClick={toggleOpen} className={formStyles.add}>
        Tambah Preview
      </Button>
      <Modal title="Tambah Preview" isOpen={isOpen} onClose={toggleOpen}>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <Flex className={formStyles.group}>
            <Label htmlFor="name">Gambar :</Label>
            <FileDialog name="preview" placeholder="Masukkan preview ..." selectedFile={file?.name} onChange={handleFileChange} />
            <Error error={error} />
          </Flex>
          <FormAction onCancel={toggleOpen} />
        </form>
      </Modal>
    </>
  )
}

export default AddDormitoryPreview
