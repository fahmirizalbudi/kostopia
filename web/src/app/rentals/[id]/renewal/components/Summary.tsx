"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Flex from "@/app/components/layout/Flex"
import styles from "./Summary.module.scss"
import { Rental } from "@/app/types/rental"
import { findRoom } from "@/app/data-access/rooms"
import { findDormitory } from "@/app/data-access/dormitories"
import { fetchDormitoryPreviews } from "@/app/data-access/dormitory-previews"
import { useSession } from "next-auth/react"
import { useDataProvider } from "../contexts/DataProvider"

const Summary = ({ rental }: { rental: Rental }) => {
  const [room, setRoom] = useState<any>(null)
  const [dormitory, setDormitory] = useState<any>(null)
  const [dormitoryPreview, setDormitoryPreview] = useState<any>(null)
  const { data: session } = useSession()
  const { setDuration, duration } = useDataProvider()

  useEffect(() => {
    setDuration(1)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const roomRes = await findRoom({
        accessToken: String(session?.accessToken),
        where: Number(rental.room_id),
      })
      setRoom(roomRes)

      const dormRes = await findDormitory({
        where: Number(roomRes.dormitory_id),
      })
      setDormitory(dormRes)

      const previewRes = await fetchDormitoryPreviews({
        where: Number(dormRes.id),
      })
      setDormitoryPreview(previewRes)
    }

    fetchData()
  }, [rental.room_id])

  if (!room || !dormitory || !dormitoryPreview) return null

  return (
    <Flex className={styles.rental}>
      <Image src={String(dormitoryPreview[0].url)} height={110} width={110} alt="Rental" className={styles.rentalImage} />
      <Flex className={styles.rentalContent}>
        <Flex className={styles.rentalContentWrapper}>
          <span className={styles.rentalName}>
            {dormitory.name} - {room.room_number}
          </span>
          <ul className={styles.rentalSpecifications}>
            <li className={styles.rentalSpecification}>
              <span className={styles.specificationTitle}>
                Perpanjang Mulai: <span className={styles.specificationBody}>{new Date().toLocaleDateString("id-ID")}</span>
              </span>
            </li>
            <li className={styles.rentalSpecification}>
              <span className={styles.specificationTitle}>
                Lama Perpanjang:&nbsp;
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={`${styles.specificationBody} ${styles.inputDuration}`}
                />
                <span className={styles.specificationBody}>&nbsp; Bulan</span>
              </span>
            </li>
          </ul>
        </Flex>
      </Flex>
      <Flex className={styles.priceWrapper}>
        <span className={styles.priceText}>Rp {(Number(dormitory.price) * Number(duration)).toLocaleString("id-ID")}</span>
      </Flex>
    </Flex>
  )
}

export default Summary
