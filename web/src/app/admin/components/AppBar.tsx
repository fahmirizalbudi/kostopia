"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import TextBox from "@/app/components/forms/TextBox"
import Button from "@/app/components/ui/Button"
import Image from "next/image"
import { asset } from "@/app/lib/asset"
import styles from "./AppBar.module.scss"
import DatePicker from "@/app/components/forms/DatePicker"
import Flex from "@/app/components/layout/Flex"

const AppBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [startDate, setStartDate] = useState(searchParams.get("start_date") || "")
  const [endDate, setEndDate] = useState(searchParams.get("end_date") || "")
  const [keywords, setKeywords] = useState(searchParams.get("keywords") || "")

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
    <nav className={styles.appbar}>
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

      {pathname === "/admin" && <span></span>}
      <div>
        <Button className={styles.profile}>
          <Image src={asset("profile.svg")} alt="Profile" width={16} height={16} />
        </Button>
      </div>
    </nav>
  )
}

export default AppBar
