"use client"

import Image from "next/image"
import NavigationBar from "./components/layout/NavigationBar"
import Button from "./components/ui/Button"
import { menuNavigationBar } from "./menu/navigation-bar"
import styles from "./page.module.scss"
import { asset } from "./lib/asset"
import { useEffect, useState } from "react"
import Link from "./components/ui/Link"

export default function Home() {
  const [keywords, setKeywords] = useState<string>("")
  const searchParams = new URLSearchParams()
  if (keywords.trim() !== "") {
    searchParams.set("keywords", keywords)
  }

  return (
    <main>
      <NavigationBar menu={menuNavigationBar} />
      <section className={styles.hero}>
        <span className={styles.motto}>Kos Terjangkau</span>
        <p className={styles.description}>Kami memiliki lebih dari 5+ kos yang siap huni.</p>
        <h1 className={styles.display}>Temukan Kos Favoritmu</h1>
        <div className={styles.search}>
          <input
            type="text"
            className={styles.input}
            placeholder="Masukkan Nama, Kata Kunci ..."
            onChange={(e) => setKeywords(e.target.value)}
            value={keywords}
          />
          <Link className={styles.handle} href={`/dormitories?${searchParams.toString()}`}>
            <Image src={asset("search.svg")} alt="Search" width={20} height={20} />
          </Link>
        </div>
        <h2 className={styles.discover}>Jelajahi Kebutuhan Anda di Sini</h2>
        <div>
          <ul className={styles.params}>
            <li className={styles.menu}>
              <Link className={styles.anchor} href="/dormitories">
                Semua Hunian
              </Link>
            </li>
            <li className={styles.menu}>
              <Link className={styles.anchor} href="/dormitories?order=price_asc">
                Ekonomis
              </Link>
            </li>
            <li className={styles.menu}>
              <Link className={styles.anchor} href="/dormitories?order=price_desc">
                Unggulan
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
