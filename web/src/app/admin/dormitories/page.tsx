import Flex from "@/app/components/layout/Flex"
import SafeView from "../components/SafeView"
import styles from "./page.module.scss"
import Cumbs from "../components/Cumbs"
import Break from "../components/Break"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import { asc, rupiah } from "@/app/utils/utils"
import { FIELD_ID } from "@/app/constants/field"
import { Dormitory } from "@/app/types/dormitory"
import { fetchDormitories } from "@/app/data-access/dormitories"
import AddDormitory from "./components/AddDormitory"
import EditDormitory from "./components/EditDormitory"
import DeleteDormitory from "./components/DeleteDormitory"
import PreviewsDormitory from "./components/PreviewsDormitory"

const Dormitories = async () => {
  const dormitories = await fetchDormitories()

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading="Kos" description="Manajemen data untuk melihat, menambah, atau menghapus kos." />
        <AddDormitory />
      </Flex>
      <Break height={30} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>NAMA</TableHead>
            <TableHead>ALAMAT</TableHead>
            <TableHead>DESKRIPSI</TableHead>
            <TableHead>HARGA</TableHead>
            <TableHead>AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asc(dormitories, FIELD_ID)?.map((dormitory: Dormitory, i: number) => (
            <TableRow key={dormitory.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{dormitory.name}</TableCell>
              <TableCell>{dormitory.address}</TableCell>
              <TableCell>{Number(dormitory?.description?.length) > 100 ? dormitory?.description?.substring(0, 100) + "..." : dormitory?.description}</TableCell>
              <TableCell>{rupiah(dormitory.price as number)}</TableCell>
              <TableCell className={styles.actions}>
                <EditDormitory {...dormitory} />
                <DeleteDormitory {...dormitory} />
                <PreviewsDormitory {...dormitory} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SafeView>
  )
}

export default Dormitories
