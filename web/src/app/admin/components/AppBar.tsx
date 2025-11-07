"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import TextBox from "@/app/components/forms/TextBox"
import { asset } from "@/app/lib/asset"
import styles from "./AppBar.module.scss"
import DatePicker from "@/app/components/forms/DatePicker"
import Flex from "@/app/components/layout/Flex"
import Profile from "@/app/components/layout/Profile"

const AppBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [startDate, setStartDate] = useState(searchParams.get("start_date") || "")
  const [endDate, setEndDate] = useState(searchParams.get("end_date") || "")
  const [keywords, setKeywords] = useState(searchParams.get("keywords") || "")
  const [scrolled, setScrolled] = useState<Boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (keywords) params.set("keywords", keywords)
      else params.delete("keywords")

      if (startDate) params.set("start_date", startDate)
      else params.delete("start_date")

      if (endDate) params.set("end_date", endDate)
      else params.delete("end_date")

      router.push(`?${params.toString()}`)
    }, 500)

    return () => clearTimeout(timeout)
  }, [keywords, startDate, endDate])

  return (
    <nav className={`${styles.appbar} ${scrolled ? styles.scrolled : ""}`}>
      {(pathname === "/admin/report" || pathname === "/admin/transactions") && (
        <Flex className={styles.dateFilter}>
          <TextBox
            placeholder="Cari kata kunci ..."
            type="text"
            icon={asset("magnify.svg")}
            iconSize={21}
            iconGap={6}
            className={styles.search}
            onChange={(e) => setKeywords(e.target.value)}
            value={keywords}
          />
          <DatePicker placeholder="Mulai (dd-mm-yyyy)" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={styles.date} />
          <DatePicker placeholder="Sampai (dd-mm-yyyy)" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.date} />
        </Flex>
      )}

      {pathname !== "/admin" && pathname !== "/admin/report" && pathname !== "/admin/transactions" && (
        <TextBox
          placeholder="Cari kata kunci ..."
          type="text"
          icon={asset("magnify.svg")}
          iconSize={21}
          iconGap={6}
          className={styles.search}
          onChange={(e) => setKeywords(e.target.value)}
          value={keywords}
        />
      )}

      {pathname === "/admin" && (
        <div className={styles.greeting}>
            <span className={styles.welcome}>Halo, Admin 👋</span>
            <p className={styles.date}>
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
        </div>
      )}
      <Profile />
    </nav>
  )
}

export default AppBar
