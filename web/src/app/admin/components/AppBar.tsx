"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import TextBox from "@/app/components/forms/TextBox"
import Button from "@/app/components/ui/Button"
import Image from "next/image"
import { asset } from "@/app/lib/asset"
import styles from "./AppBar.module.scss"

const AppBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [keywords, setKeywords] = useState(searchParams.get("keywords") || "")

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (keywords) params.set("keywords", keywords)
      else params.delete("keywords")
      router.push(`?${params.toString()}`)
    }, 500)

    return () => clearTimeout(timeout)
  }, [keywords])

  return (
    <nav className={styles.appbar}>
      {pathname !== "/admin" ? (
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
      ) : (
        // <span className={styles.greeting}><span className={styles.welcome}>Hello!</span> Let’s find something great 👋</span>
        <span></span>
      )}
      <div>
        <Button className={styles.profile}>
          <Image src={asset("profile.svg")} alt="Profile" width={16} height={16} />
        </Button>
      </div>
    </nav>
  )
}

export default AppBar
