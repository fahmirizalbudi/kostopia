"use client"

import { menuNavigationBarProps } from "@/app/menu/navigation-bar"
import { asset } from "@/app/lib/asset"
import Image from "next/image"
import styles from "./NavigationBar.module.scss"
import { useSession } from "next-auth/react"
import Link from "../ui/Link"
import Profile from "./Profile"
import Flex from "./Flex"
import { useState } from "react"
import Tooltip from "../ui/Tooltip"

type NavigationBarProps = {
  menu: menuNavigationBarProps[]
}

const NavigationBar = ({ menu }: NavigationBarProps) => {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Image src={asset("favicon.svg")} alt="Logo" width={153.067} height={58} />
      </div>

      <ul className={`${styles.menu} ${open ? styles.active : ""}`}>
        {menu.map((item, i) => (
          <li key={i} className={styles.i}>
            <Link href={item.linkTo} className={styles.anchor} onClick={() => setOpen(false)}>
              {item.menu}
            </Link>
          </li>
        ))}

        <div className={styles.mobileAuth}>
          {status === "authenticated" ? (
            <>
              <Link href="/rentals" onClick={() => setOpen(false)} className={styles.textLink}>
                Riwayat
              </Link>
              <Link href="/profile" onClick={() => setOpen(false)} className={styles.textLink}>
                Profil
              </Link>
            </>
          ) : (
            <Link className={styles.login} href="/auth/login" onClick={() => setOpen(false)}>
              Log In
            </Link>
          )}
        </div>
      </ul>

      <div className={styles.desktopRight}>
        {status === "authenticated" ? (
          <Flex className={styles.right}>
            <Link href="/rentals">
              <Tooltip text="Histori" placement="bottom">
                <Image src={asset("clock.svg")} alt="Riwayat" width={25} height={25} />
              </Tooltip>
            </Link>
            <Profile />
          </Flex>
        ) : (
          <Link className={styles.login} href="/auth/login">
            Log In
          </Link>
        )}
      </div>

      <button className={`${styles.burger} ${open ? styles.open : ""}`} onClick={() => setOpen(!open)} aria-label="Toggle navigation menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  )
}

export default NavigationBar
