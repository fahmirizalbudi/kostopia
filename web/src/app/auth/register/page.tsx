"use client"

import React, { useState } from "react"
import styles from "./page.module.scss"
import Flex from "@/app/components/layout/Flex"
import Label from "@/app/components/forms/Label"
import TextBox from "@/app/components/forms/TextBox"
import formStyles from "@/app/components/forms/Action.module.scss"
import Image from "next/image"
import { asset } from "@/app/lib/asset"
import Error from "@/app/components/forms/Error"
import { User } from "@/app/types/user"
import { API } from "@/app/constants/api"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import nProgress from "nprogress"
import Link from "@/app/components/ui/Link"

const Register = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    password: "",
    role: "",
    address: "",
    phone: "",
  })
  const [error, setError] = useState<string | undefined>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch(API + "/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    })
    if (res.ok) {
      nProgress.start()
      toast.success("Berhasil register !", {
        duration: 3000,
      })
      setTimeout(() => {
        router.push("/auth/login")
      }, 1000)
      return
    }
    toast.error("Gagal register !", {
      duration: 3000,
    })
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image src={asset("logo.png")} alt="Logo" width={32} height={32} />
          </div>
          <h1 className={styles.title}>Selamat Datang</h1>
          <p className={styles.subtitle}>Silahkan register untuk mendaftar</p>
        </div>

        <form className={formStyles.form} onSubmit={handleSubmit}>
          <Flex className={formStyles.group}>
            <Label htmlFor="name">Nama :</Label>
            <TextBox name="name" type="text" placeholder="Masukkan nama ..." onChange={handleChange} />
          </Flex>
          <Flex className={formStyles.group}>
            <Label htmlFor="email">Email :</Label>
            <TextBox name="email" type="email" placeholder="Masukkan email ..." onChange={handleChange} />
          </Flex>
          <Flex className={formStyles.group}>
            <Label htmlFor="password">Password :</Label>
            <TextBox name="password" type="text" placeholder="Masukkan password ..." onChange={handleChange} />
            <Error error={error} />
          </Flex>

          <button type="submit" className={styles.loginButton}>
            Register
          </button>
        </form>

        <div className={styles.footer}>
          Sudah punya akun?{" "}
          <Link href="/auth/login" className={styles.signupLink}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
