"use client"

import Action from "@/app/components/forms/Action"
import ComboBox, { Option } from "@/app/components/forms/ComboBox"
import TextBox from "@/app/components/forms/TextBox"
import Flex from "@/app/components/layout/Flex"
import { asset } from "@/app/lib/asset"
import styles from "../page.module.scss"

const FilterDormitory = () => {
  const prices: Option[] = [{ value: "300000 - 500000", label: "Rp350.000 - Rp500.000" }]

  const facilities: Option[] = [
    { value: "ac", label: "AC" },
    { value: "wifi", label: "Wi-Fi" },
    { value: "parkir", label: "Parkir" },
  ]

  return (
    <Flex className={styles.filterContainer}>
      <TextBox name="search" type="text" placeholder="Masukkan kata kunci pencarian ..." className={styles.search} />
      <ComboBox options={prices} placeholder="Urutkan berdasarkan" className={styles.orderBy} />
      <ComboBox options={prices} placeholder="Rentang harga" />
      <ComboBox options={facilities} placeholder="Fasilitas" />
      <Action icon={asset("reload.svg")} size={18} as="Refresh" className={styles.action} />
      <Action icon={asset("search_02.svg")} size={19} as="Search" className={styles.action} />
    </Flex>
  )
}

export default FilterDormitory
