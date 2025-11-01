"use client"

import Image from "next/image"
import Button from "../ui/Button"
import { asset } from "@/app/lib/asset"
import styles from "./Profile.module.scss"
import { Modal } from "../ui/Modal"
import { useEffect, useState } from "react"
import formStyles from "@/app/components/forms/Action.module.scss"
import Flex from "@/app/components/layout/Flex"
import TextBox from "@/app/components/forms/TextBox"
import FormAction from "@/app/components/forms/FormAction"
import Label from "../forms/Label"
import { User } from "@/app/types/user"
import { findUser, updateUser } from "@/app/data-access/users"
import { signOut, useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const Profile = () => {
  const router = useRouter()
  const session = useSession()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [profile, setProfile] = useState<User>()

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
  const toggleOpen = () => setIsOpen(!isOpen)

  useEffect(() => {
    const getProfile = async () => {
      const { data } = await findUser({
        accessToken: session.data?.accessToken as string,
        where: Number(session.data?.user?.id),
      })
      setProfile(data)
    }
    getProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    delete profile?.id
    delete profile?.created_at
    delete profile?.updated_at

    const res = await updateUser({
      accessToken: session.data?.accessToken as string,
      schema: profile as User,
      where: Number(session.data?.user?.id),
    })

    if (!res.ok) {
      return toast.error("Terjadi kesalahan!", { duration: 3000 })
    }

    setIsOpen(false)
    toast.success("Profil Pengguna berhasil diperbarui!", { duration: 3000 })
    router.refresh()
  }

  const logout = () => {
    signOut()
    router.push("/")
  }

  return (
    <>
      <Button className={styles.profile} onClick={toggleDropdown}>
        <Image src={asset("profile.svg")} alt="Profile" width={16} height={16} />

        {isDropdownOpen && (
          <div className={styles.dropdown}>
            <button
              onClick={() => {
                toggleOpen()
                setIsDropdownOpen(false)
              }}
            >
              Profile
            </button>
            <button onClick={() => logout()}>Logout</button>
          </div>
        )}
      </Button>

      <Modal title="Profil Pengguna" isOpen={isOpen} onClose={toggleOpen}>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <Flex className={formStyles.group}>
            <Label htmlFor="name">Nama :</Label>
            <TextBox type="text" name="name" placeholder={String(profile?.name)} onChange={handleChange} />
            <small className={styles.helper}>Klik lalu ketik untuk mengubah.</small>
          </Flex>

          <Flex className={formStyles.group}>
            <Label htmlFor="email">Email :</Label>
            <TextBox type="text" name="email" placeholder={String(profile?.email)} onChange={handleChange} />
            <small className={styles.helper}>Klik lalu ketik untuk mengubah.</small>
          </Flex>

          <Flex className={formStyles.group}>
            <Label htmlFor="password">Password :</Label>
            <TextBox type="text" name="password" placeholder="••••••••" onChange={handleChange} />
            <small className={styles.helper}>Klik lalu ketik untuk mengubah.</small>
          </Flex>

          <Flex className={formStyles.group}>
            <Label htmlFor="phone">Seluler :</Label>
            <TextBox type="text" name="phone" placeholder={String(profile?.phone)} onChange={handleChange} />
            <small className={styles.helper}>Klik lalu ketik untuk mengubah.</small>
          </Flex>

          <Flex className={formStyles.group}>
            <Label htmlFor="address">Alamat :</Label>
            <TextBox type="text" name="address" placeholder={String(profile?.address)} onChange={handleChange} />
            <small className={styles.helper}>Klik lalu ketik untuk mengubah.</small>
          </Flex>

          <FormAction onCancel={toggleOpen} customSubmitText="Record" />
        </form>
      </Modal>
    </>
  )
}

export default Profile
