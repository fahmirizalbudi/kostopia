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
import { getSession, signIn } from "next-auth/react"

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState<string | undefined>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    })

    if (res?.ok) {
      const session = await getSession()

      if (session?.user?.role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/"
      }
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image src={asset("logo.png")} alt="Logo" width={32} height={32} />
          </div>
          <h1 className={styles.title}>Selamat Datang</h1>
          <p className={styles.subtitle}>Silahkan log in untuk melanjutkan</p>
        </div>

        <form className={formStyles.form} onSubmit={handleSubmit}>
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
            Log In
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account?{" "}
          <a href="#" className={styles.signupLink}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
