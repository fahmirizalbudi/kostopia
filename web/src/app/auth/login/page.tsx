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

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })

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

      nProgress.start()
      if (session?.user?.role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/"
      }
    } else {
      toast.error("Username atau password salah!", {
        duration: 3000,
      })
    }
  }

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-form"]}>
        <div className={styles["login-form-inner"]}>
          <Image src={asset("favicon.svg")} alt="" width={153.067} height={58} />

          <Flex className={styles.loginHeader}>
            <h1 className={styles.headerTitle}>Log In</h1>
            <p className={styles.headerDescription}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates, eligendi!</p>
          </Flex>

          <Flex className={styles.loginBody}>
            <form className={formStyles.form} onSubmit={handleSubmit}>
              <Flex className={formStyles.group}>
                <Label htmlFor="email">Email :</Label>
                <TextBox name="email" type="email" placeholder="Masukkan email ..." value={formData.email} onChange={handleChange} />
              </Flex>
              <Flex className={formStyles.group}>
                <Label htmlFor="password">Password :</Label>
                <TextBox name="password" type="password" placeholder="Masukkan password ..." value={formData.password} onChange={handleChange} />
              </Flex>
              <Button type="submit" className={styles.loginButton}>
                Log In
              </Button>
            </form>
          </Flex>
        </div>
        <Flex className={styles.cta}>
          <p className={styles.text}>
            Belum punya akun?{" "}
            <Link href="/auth/register" className={styles.link}>
              Register
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

export default Login
