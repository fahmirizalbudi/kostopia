"use client"

import Action from "@/app/components/forms/Action"
import ComboBox, { Option } from "@/app/components/forms/ComboBox"
import TextBox from "@/app/components/forms/TextBox"
import Flex from "@/app/components/layout/Flex"
import { asset } from "@/app/lib/asset"
import styles from "../page.module.scss"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import nProgress from "nprogress"
import { findOption } from "@/app/utils/utils"

type FilterDormitoryProps = {
  facilities: Option[]
  prices: Option[]
}

const FilterDormitory = ({ facilities, prices }: FilterDormitoryProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [keywords, setKeywords] = useState<string>(searchParams.get("keywords") || "")
  const [price, setPrice] = useState<string>(searchParams.get("price") || "")
  const [facility, setFacility] = useState<string>(searchParams.get("facility") || "")
  const [order, setOrder] = useState<string>(searchParams.get("order") || "")
  const orders: Option[] = [
    { value: "price_asc", label: "Harga: Terendah ke Tertinggi" },
    { value: "price_desc", label: "Harga: Tertinggi ke Terendah" },
    { value: "name_asc", label: "Nama: A-Z" },
    { value: "name_desc", label: "Nama: Z-A" },
  ]

  const handleSearch = () => {
    nProgress.start()

    const params = new URLSearchParams()
    if (keywords) params.set("keywords", keywords)
    if (price) params.set("price", price)
    if (facility) params.set("facility", facility)
    if (order) params.set("order", order)

    setTimeout(() => {
      router.replace(`/dormitories?${params.toString()}`)
      setTimeout(() => {
        nProgress.done()
      }, 500)
    }, 1000)
  }

  const handleRefresh = () => {
    nProgress.start()
    setKeywords("")
    setPrice("")
    setFacility("")
    setOrder("")
    setTimeout(() => {
      router.replace(`/dormitories`)
      setTimeout(() => {
        nProgress.done()
      }, 500)
    }, 1000)
  }

  return (
    <Flex className={styles.filterContainer}>
      <TextBox
        name="search"
        type="text"
        placeholder="Masukkan kata kunci pencarian ..."
        className={styles.search}
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <ComboBox
        options={orders}
        value={findOption(orders, order)}
        onChange={(option) => setOrder(option)}
        placeholder="Urutkan berdasarkan"
        className={styles.orderBy}
      />
      <ComboBox options={prices} value={findOption(prices, price)} onChange={(option) => setPrice(option)} placeholder="Rentang harga" />
      <ComboBox options={facilities} placeholder="Fasilitas" value={findOption(facilities, facility)} onChange={(option) => setFacility(option)} />
      <Action icon={asset("reload.svg")} size={18} as="Refresh" className={styles.action} onAction={handleRefresh} />
      <Action icon={asset("search_02.svg")} size={19} as="Search" className={styles.action} onAction={handleSearch} />
    </Flex>
  )
}

export default FilterDormitory
