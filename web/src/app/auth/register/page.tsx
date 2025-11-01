"use client"

import React, { useState } from "react"
import styles from "./page.module.scss"
import Image from "next/image"
import { asset } from "@/app/lib/asset"
import Flex from "@/app/components/layout/Flex"
import TextBox from "@/app/components/forms/TextBox"
import Label from "@/app/components/forms/Label"
import formStyles from "@/app/components/forms/Action.module.scss"
import Button from "@/app/components/ui/Button"
import Link from "@/app/components/ui/Link"
import { getSession, signIn } from "next-auth/react"
import toast from "react-hot-toast"
import nProgress from "nprogress"
import { useRouter } from "next/navigation"
import { API } from "@/app/constants/api"

const Register = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", address: "" })

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
    <div className={styles["register-container"]}>
      <div className={styles["register-form"]}>
        <div className={styles["register-form-inner"]}>
          <Image src={asset("favicon.png")} alt="" width={153.067} height={58} />

          <Flex className={styles.registerHeader}>
            <h1 className={styles.headerTitle}>Get Started</h1>
            <p className={styles.headerDescription}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates, eligendi!</p>
          </Flex>

          <Flex className={styles.registerBody}>
            <form className={formStyles.form} onSubmit={handleSubmit}>
              <Flex className={formStyles.group}>
                <Label htmlFor="name">Nama :</Label>
                <TextBox name="name" type="text" placeholder="Masukkan nama ..." value={formData.name} onChange={handleChange} />
              </Flex>
              <Flex className={formStyles.group}>
                <Label htmlFor="email">Email :</Label>
                <TextBox name="email" type="email" placeholder="Masukkan email ..." value={formData.email} onChange={handleChange} />
              </Flex>
              <Flex className={formStyles.group}>
                <Label htmlFor="password">Password :</Label>
                <TextBox name="password" type="password" placeholder="Masukkan password ..." value={formData.password} onChange={handleChange} />
              </Flex>
              <Flex className={formStyles.group}>
                <Label htmlFor="phone">Seluler :</Label>
                <TextBox name="phone" type="text" placeholder="Masukkan seluler ..." value={formData.phone} onChange={handleChange} />
              </Flex>
              <Flex className={formStyles.group}>
                <Label htmlFor="address">Alamat :</Label>
                <TextBox name="address" type="text" placeholder="Masukkan alamat ..." value={formData.address} onChange={handleChange} />
              </Flex>
              <Button type="submit" className={styles.registerButton}>
                Register
              </Button>
            </form>
          </Flex>
        </div>
        <Flex className={styles.cta}>
          <p className={styles.text}>
            Sudah punya akun?{" "}
            <Link href="/auth/login" className={styles.link}>
              Log In
            </Link>
            .
          </p>
        </Flex>
      </div>

      <div className={styles.onboarding}>
        <img src={asset("illustration.png")} width={980} />
      </div>
    </div>
  )
}

export default Register
