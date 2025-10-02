"use client"

import { useState, ReactNode } from "react"
import styles from "./Tabs.module.scss"
import { usePathname } from "next/navigation"
import Link from "./Link"

type TabItem = {
  label: string
  href: string
}

type TabsProps = {
  items: TabItem[]
}

export default function Tabs({ items }: TabsProps) {
  const pathname = usePathname()

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        {items.map((item, idx) => (
          <Link key={idx} className={`${styles.tabButton} ${pathname === item.href ? styles.active : ""}`} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
