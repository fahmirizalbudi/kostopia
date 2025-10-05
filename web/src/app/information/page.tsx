"use client"

import Image from "next/image"
import NavigationBar from "@/app/components/layout/NavigationBar"
import { menuNavigationBar } from "@/app/menu/navigation-bar"
import styles from "./page.module.scss"
import { asset } from "@/app/lib/asset"

export default function Information() {
  return (
    <main>
      <NavigationBar menu={menuNavigationBar} />

      <section className={styles.hero}>
        <span className={styles.motto}>Informasi</span>
        <h1 className={styles.display}>Berita & Panduan</h1>
        <p className={styles.description}>Dapatkan berbagai informasi penting mengenai layanan, tips memilih kos, dan update terbaru dari kami.</p>
        <Image src={asset("informasi.png")} alt="Informasi" width={400} height={250} />
      </section>

      <section className={styles.content}>
        <h2 className={styles.title}>Panduan Penggunaan</h2>
        <p>Halaman ini berisi panduan singkat untuk menggunakan website, termasuk cara mencari kos, memfilter harga, dan menghubungi pemilik.</p>

        <h2 className={styles.title}>Update Terbaru</h2>
        <ul className={styles.list}>
          <li>Update fitur filter kos berdasarkan harga dan fasilitas.</li>
          <li>Pembaruan tampilan profil pengguna.</li>
        </ul>
      </section>
    </main>
  )
}
