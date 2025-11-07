import Flex from "@/app/components/layout/Flex"
import SafeView from "../components/SafeView"
import Cumbs from "../components/Cumbs"
import styles from "./page.module.scss"
import Break from "../components/Break"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import { FIELD_ID } from "@/app/constants/field"
import { asc, filter } from "@/app/utils/utils"
import { fetchRooms } from "@/app/data-access/rooms"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Room } from "@/app/types/room"
import { RoomStatus } from "@/app/enums/room.enums"
import AddRoom from "./components/AddRoom"
import EditRoom from "./components/EditRoom"
import DeleteRoom from "./components/DeleteRoom"
import ExportPDF from "@/app/components/ui/ExportPDF"
import ExportCSV from "@/app/components/ui/ExportCSV"

type RoomsProps = {
  searchParams?: {
    keywords?: string
  }
}

const Rooms = async ({ searchParams }: RoomsProps) => {
  const session = await getServerSession(authOptions)
  const rooms = await fetchRooms({
    accessToken: String(session?.accessToken),
  })

  const keywords = searchParams?.keywords?.toLowerCase()
  const filteredRooms = filter<Room>().fromData(rooms).byKeywords(keywords).get()

  const roomsReport = filteredRooms?.map((room: Room) => ({
    kos: room.dormitory?.name,
    "NOMOR KAMAR": room.room_number,
    status: room.status === "rented" ? "Disewa" : "Tersedia",
  }))

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading="Kamar Kos" description="Manajemen data kamar, tambah, edit, dan hapus." />
        <Flex gap={10}>
          <ExportPDF
            data={roomsReport}
            filename={`rooms${keywords ? `-${keywords}` : ""}.pdf`}
            title={`Rekap Data Kamar Kos${keywords ? ` (filter: ${keywords})` : ""}`}
          />
          <ExportCSV
            data={roomsReport}
            filename={`rooms${keywords ? `-${keywords}` : ""}.csv`}
            title={`Rekap Data Kamar Kos${keywords ? ` (filter: ${keywords})` : ""}`}
          />
          <AddRoom />
        </Flex>
      </Flex>
      <Break height={30} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>KOS</TableHead>
            <TableHead>NOMOR KAMAR</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asc(filteredRooms, FIELD_ID)?.map((room: Room, i: number) => (
            <TableRow key={room.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{room.dormitory?.name}</TableCell>
              <TableCell>{room.room_number}</TableCell>
              <TableCell>{room.status === RoomStatus.Available ? "Tersedia" : "Disewa"}</TableCell>
              <TableCell className={styles.actions}>
                <EditRoom {...room} />
                <DeleteRoom {...room} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SafeView>
  )
}

export default Rooms
