"use client"

import Image from "next/image"
import styles from "./SideNavigation.module.scss"
import { asset } from "@/app/lib/asset"
import { MENU_SIDE_HEADER, MENU_SIDE_LINK, menuSideNavigationProps } from "@/app/data/menu"
import { usePathname } from "next/navigation"
import Link from "next/link"

type SideNavigationHeaderProps = {
  text: string
}

type SideNavigationListProps = {
  icon: string
  label: string
  linkTo: string
  isActive?: boolean
}

type SideNavigationProps = {
  menu: menuSideNavigationProps[]
}

const SideNavigationHeader = ({ text }: SideNavigationHeaderProps) => <li className={styles.header}>{text}</li>

const SideNavigationList = ({ icon, label, linkTo, isActive = false }: SideNavigationListProps) => (
  <li className={`${styles.list}`}>
    <Link href={linkTo} className={`${styles.link} ${isActive ? styles.active : ""}`}>
      <div className={styles.icon}>
        <Image className={styles.svg} src={icon} alt="icon" width={20} height={20} />
      </div>
      <div className={styles.label}>
        <span className={styles.text}>{label}</span>
      </div>
    </Link>
  </li>
)

const SideNavigation = ({ menu }: SideNavigationProps) => {
  const pathname = usePathname()

  return (
    <>
      <nav className={styles.sidebar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Image src={asset("logo.png")} alt="Logo" width={35} height={35} priority />
            <Image src={asset("close.png")} alt="Close" className={styles.close} width={19} height={19} />
          </div>
          <div className={styles.content}>
            <ul className={styles.menu}>
              {menu.map((item, i) => (
                item.type === MENU_SIDE_HEADER ? (
                  <SideNavigationHeader key={i} text={item.text} />
                ) :
                item.type === MENU_SIDE_LINK && (
                  <SideNavigationList key={i} icon={asset(item.icon ?? "")} label={item.text} linkTo={item.linkTo ?? "#"} isActive={pathname === item.linkTo}  />
                )
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default SideNavigation
