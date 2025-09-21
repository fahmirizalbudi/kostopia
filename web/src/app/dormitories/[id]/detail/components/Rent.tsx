"use client"

import Flex from "@/app/components/layout/Flex"
import styles from "../page.module.scss"
import TextBox from "@/app/components/forms/TextBox"
import Button from "@/app/components/ui/Button"
import { useState } from "react"
import DatePicker from "@/app/components/forms/DatePicker"
import { asset } from "@/app/lib/asset"

const Rent = () => {
  const [room, setRoom] = useState<String>()
  const [startDate, setStartDate] = useState<String>("")
  const [duration, setDuration] = useState<Number>()

  const handleClick = () => {
    console.log({ room, startDate, duration })
  }

  return (
    <Flex className={styles.rent}>
      <span className={styles.name}>Atur Penyewaan</span>
      <Flex className={styles.options}>
        <div className={styles.option}>
          <input type="radio" id="KK001" name="size" value="KK001" onChange={(e) => setRoom(e.target.value)} />
          <label htmlFor="KK001">KK001</label>
        </div>
        <div className={styles.option}>
          <input type="radio" id="KK002" name="size" value="KK002" disabled />
          <label htmlFor="KK002">KK002</label>
        </div>
        <div className={styles.option}>
          <input type="radio" id="KK003" name="size" value="KK003" onChange={(e) => setRoom(e.target.value)} />
          <label htmlFor="KK003">KK003</label>
        </div>
      </Flex>
      <DatePicker placeholder="Mulai sewa (dd-mm-yyyy)" value={startDate} onChange={(e) => setStartDate(String(e.target.value))} />
      <TextBox
        type="number"
        placeholder="Periode sewa (bulan)"
        icon={asset("ordered.svg")}
        iconSize={18}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(Number(e.target.value))}
      />
      <Button className={styles.rentNow} onClick={handleClick}>
        Sewa Sekarang!
      </Button>
    </Flex>
  )
}

export default Rent
