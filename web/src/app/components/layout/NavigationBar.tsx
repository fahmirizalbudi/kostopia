"use client"

import { menuNavigationBarProps } from "@/app/menu/navigation-bar"
import { asset } from "@/app/lib/asset"
import Image from "next/image"
import styles from "./NavigationBar.module.scss"
import { useSession } from "next-auth/react"
import Link from "../ui/Link"
import Profile from "./Profile"
import Flex from "./Flex"

type NavigationBarProps = {
  menu: menuNavigationBarProps[]
}

const NavigationBar = ({ menu }: NavigationBarProps) => {
  const { data: session, status } = useSession()

  return (
    <nav className={styles.nav}>
      <Image src={asset("favicon.png")} alt="" width={153.067} height={58} />
      <ul className={styles.menu}>
        {menu.map((item, i) => (
          <li key={i} className={styles.i}>
            <Link href={item.linkTo} className={styles.anchor}>
              {item.menu}
            </Link>
          </li>
        ))}
      </ul>

      {status === "authenticated" ? (
        <Flex className={styles.right}>
          <Link href="/rentals">
            <Image src={asset("history.svg")} alt="Logo" width={25} height={25} />
          </Link>
          <Profile />
        </Flex>
      ) : (
        <Link className={styles.login} href="/auth/login">
          Log In
        </Link>
      )}
    </nav>
  )
}

export default NavigationBar
