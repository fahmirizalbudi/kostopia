"use client"

import { menuNavigationBarProps } from "@/app/menu/navigation-bar"
import { asset } from "@/app/lib/asset"
import Image from "next/image"
import Button from "../ui/Button"
import styles from "./NavigationBar.module.scss"
import { useSession } from "next-auth/react"
import Link from "../ui/Link"

type NavigationBarProps = {
  menu: menuNavigationBarProps[]
}

const NavigationBar = ({ menu }: NavigationBarProps) => {
  const { data: session, status } = useSession()

  return (
    <nav className={styles.nav}>
      <Image src={asset("logo.png")} alt="Logo" width={35} height={35} />
      <ul className={styles.menu}>
        {menu.map((item, i) => (
          <li key={i} className={styles.i}>
            <Link href={item.linkTo} className={styles.anchor}>{item.menu}</Link>
          </li>
        ))}
      </ul>

      {status === "authenticated" ? (
        <Button className={styles.profile}>
          <Image src={asset("profile.svg")} alt="Profile" width={16} height={16} />
        </Button>
      ) : (
        <Link className={styles.login} href="/auth/login">Log In</Link>
      )}
    </nav>
  )
}

export default NavigationBar
