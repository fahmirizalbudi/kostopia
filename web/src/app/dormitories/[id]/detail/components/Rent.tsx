"use client"

import Flex from "@/app/components/layout/Flex"
import styles from "../page.module.scss"
import TextBox from "@/app/components/forms/TextBox"
import Button from "@/app/components/ui/Button"
import { useEffect, useState } from "react"
import DatePicker from "@/app/components/forms/DatePicker"
import { asset } from "@/app/lib/asset"
import { Room } from "@/app/types/room"
import { getRoomsByDormitory } from "@/app/data-access/rooms"
import { useParams } from "next/navigation"
import nProgress from "nprogress"
import { useSession } from "next-auth/react"
import { createRental } from "@/app/data-access/rentals"
import { useRouter } from "next/navigation"
import { asc } from "@/app/utils/utils"
import { FIELD_ID } from "@/app/constants/field"

const Rent = () => {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [rooms, setRooms] = useState<Room[]>()
  const [roomId, setRoomId] = useState<Number | null>(null)
  const [startDate, setStartDate] = useState<String>("")
  const [durationMonths, setDurationMonths] = useState<Number | null>(null)

  useEffect(() => {
    const fetchRooms = async () => {
      const rooms = await getRoomsByDormitory({
        where: Number(id),
      })
      setRooms(asc(rooms, FIELD_ID))
    }
    fetchRooms()
  }, [id])

  const handleClick = async () => {
    const res = await createRental({
      accessToken: String(session?.accessToken),
      schema: {
        room_id: Number(roomId),
        start_date: String(startDate),
        duration_months: Number(durationMonths),
      },
    })
    setRoomId(null)
    setStartDate("")
    setDurationMonths(null)

    const json = await res.json()
    const rentalId = json.data.id

    nProgress.start()
    router.push(`/rentals/${rentalId}/transaction`)
  }

  return (
    <Flex className={styles.rent}>
      <span className={styles.name}>Atur Penyewaan</span>
      <Flex className={styles.options}>
        {rooms?.map((room) => (
          <Flex className={styles.option} key={room.id}>
            <input
              type="radio"
              id={String(room.id)}
              name="room_id"
              value={room.id}
              disabled={String(room.status) === "rented"}
              onChange={(e) => setRoomId(Number(e.target.value))}
            />
            <label htmlFor={String(room.id)}>{room.room_number}</label>
          </Flex>
        ))}
      </Flex>
      <DatePicker placeholder="Mulai sewa (dd-mm-yyyy)" value={startDate} onChange={(e) => setStartDate(String(e.target.value))} />
      <TextBox
        type="number"
        placeholder="Periode sewa (bulan)"
        icon={asset("ordered.svg")}
        iconSize={18}
        value={durationMonths ? Number(durationMonths) : ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDurationMonths(Number(e.target.value))}
      />
      <Button className={styles.rentNow} onClick={handleClick} disabled={(!roomId || !durationMonths || !startDate)}>
        Sewa Sekarang!
      </Button>
    </Flex>
  )
}

export default Rent
