import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import Cumbs from "../components/Cumbs"
import SafeView from "../components/SafeView"
import styles from "./page.module.scss"
import Break from "../components/Break"
import Flex from "@/app/components/layout/Flex"
import { User } from "@/app/types/user"
import AddUser from "./components/AddUser"
import EditUser from "./components/EditUser"
import DeleteUser from "./components/DeleteUser"
import { asc, filter } from "@/app/utils/utils"
import { FIELD_ID } from "@/app/constants/field"
import { fetchUsers } from "@/app/data-access/users"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import ExportPDF from "@/app/components/ui/ExportPDF"
import ExportCSV from "@/app/components/ui/ExportCSV"

type UsersProps = {
  searchParams?: {
    keywords?: string
  }
}

const Users = async ({ searchParams }: UsersProps) => {
  const session = await getServerSession(authOptions)
  const users = await fetchUsers({
    accessToken: session?.accessToken as string,
  })

  const keywords = searchParams?.keywords?.toLowerCase()
  const filteredUsers = filter<User>().fromData(users).byKeywords(keywords).get()

  const reportUsers = users.map((user: User, i) => ({
    nama: user.name,
    email: user.email,
    role: user.role === "admin" ? "Admin" : "Penyewa",
    seluler: user.phone || "-",
    alamat: user.address || "-",
  }))

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading="Pengguna" description="Pusat data pengguna untuk melihat, menambah, atau mengelola akun." />
        <Flex gap={10}>
          <ExportPDF data={reportUsers} filename="users.pdf" title="Rekap Data Pengguna" />
          <ExportCSV data={reportUsers} filename="users.csv" title="Rekap Data Pengguna" />
          <AddUser />
        </Flex>
      </Flex>
      <Break height={30} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>NAMA</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>SELULER</TableHead>
            <TableHead>ALAMAT</TableHead>
            <TableHead>AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asc(filteredUsers, FIELD_ID)?.map((user: User, i: number) => (
            <TableRow key={user.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone?.trim() === "" ? "-" : user.phone}</TableCell>
              <TableCell>{user.address?.trim() === "" ? "-" : user.address}</TableCell>
              <TableCell className={styles.actions}>
                {/* <Button className={`${styles.action}`}>
                  <Image src={asset("edit.svg")} alt="Edit" width={18} height={18} />
                </Button> */}
                <EditUser {...user} />
                <DeleteUser {...user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SafeView>
  )
}

export default Users
