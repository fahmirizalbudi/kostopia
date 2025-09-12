import Flex from '@/app/components/layout/Flex'
import SafeView from '../components/SafeView'
import Cumbs from '../components/Cumbs'
import styles from "./page.module.scss"
import Break from '../components/Break'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import { FIELD_ID } from '@/app/constants/field'
import { asc } from '@/app/utils/utils'
import { fetchRooms } from '@/app/data-access/rooms'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Room } from '@/app/types/room'
import { RoomStatus } from '@/app/enums/room.enums'
import AddRoom from './components/AddRoom'
import EditRoom from './components/EditRoom'
import DeleteRoom from './components/DeleteRoom'

const Rooms = async () => {
  const session = await getServerSession(authOptions)
  const rooms = await fetchRooms({
    accessToken: String(session?.accessToken)
  })

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading="Kamar Kos" description="Manajemen data kamar, tambah, edit, dan hapus." />
        <AddRoom />
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
          {asc(rooms, FIELD_ID)?.map((room: Room, i: number) => (
            <TableRow key={room.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{room.dormitory?.name}</TableCell>
              <TableCell>{room.room_number}</TableCell>
              <TableCell>{room.status === RoomStatus.Available ? 'Tersedia' : 'Disewa'}</TableCell>
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