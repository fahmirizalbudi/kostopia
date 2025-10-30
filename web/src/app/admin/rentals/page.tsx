import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import Cumbs from "../components/Cumbs"
import SafeView from "../components/SafeView"
import styles from "./page.module.scss"
import Break from "../components/Break"
import Flex from "@/app/components/layout/Flex"
import { asc } from "@/app/utils/utils"
import { FIELD_ID } from "@/app/constants/field"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { fetchRentals } from "@/app/data-access/rentals"
import { Rental } from "@/app/types/rental"
import { findDormitory } from "@/app/data-access/dormitories"
import RentalInformation from "./components/RentalInformation"
import Button from "@/app/components/ui/Button"
import ExportPDF from "@/app/components/ui/ExportPDF"
import ExportCSV from "@/app/components/ui/ExportCSV"

const Rentals = async () => {
  const session = await getServerSession(authOptions)
  const rentals = await fetchRentals({
    accessToken: session?.accessToken as string,
  })

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading="Penyewaan" description="Pusat data pengguna untuk melihat, menambah, atau mengelola akun." />
        <Flex gap={10}>
          <ExportPDF />
          <ExportCSV />
        </Flex>
      </Flex>
      <Break height={30} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>PENYEWA</TableHead>
            <TableHead>TANGGAL MULAI</TableHead>
            <TableHead>DURASI SEWA</TableHead>
            <TableHead>TANGGAL SELESAI</TableHead>
            <TableHead>KAMAR</TableHead>
            <TableHead>AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asc(rentals, FIELD_ID)?.map(async (rental: Rental, i: number) => {
            const dormitory = await findDormitory({
              where: Number(rental.room?.dormitory_id),
            })

            return (
              <TableRow key={rental.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{rental?.tenant?.name}</TableCell>
                <TableCell>
                  {new Date(rental.start_date as string).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>{rental.duration_months} Bulan</TableCell>
                <TableCell>
                  {new Date(rental.end_date as string).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {dormitory.name} - {rental?.room?.room_number}
                </TableCell>
                <TableCell className={styles.actions}>
                  <RentalInformation {...rental} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </SafeView>
  )
}

export default Rentals
