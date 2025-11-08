import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import Cumbs from "../components/Cumbs"
import SafeView from "../components/SafeView"
import styles from "./page.module.scss"
import Break from "../components/Break"
import Flex from "@/app/components/layout/Flex"
import { asc, filter } from "@/app/utils/utils"
import { FIELD_ID } from "@/app/constants/field"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option"
import { fetchRentals } from "@/app/data-access/rentals"
import { Rental } from "@/app/types/rental"
import { findDormitory } from "@/app/data-access/dormitories"
import RentalInformation from "./components/RentalInformation"
import ExportPDF from "@/app/components/ui/ExportPDF"
import ExportCSV from "@/app/components/ui/ExportCSV"

type RentalsProps = {
  searchParams?: {
    keywords?: string
  }
}

const Rentals = async ({ searchParams }: RentalsProps) => {
  const session = await getServerSession(authOptions)
  const rentals = await fetchRentals({
    accessToken: session?.accessToken as string,
  })

  const keywords = searchParams?.keywords?.toLowerCase()
  const filteredRentals = filter<Rental>().fromData(rentals).byKeywords(keywords).get()

  const rentalsReport = await Promise?.all(
    (filteredRentals ?? [])?.map(async (rental: Rental) => {
      const dormitory = await findDormitory({
        where: Number(rental?.room?.dormitory_id),
      })

      return {
        penyewa: rental.tenant?.name,
        kamar: `${dormitory.name} - ${rental.room?.room_number}`,
        "TANGGAL MULAI": new Date(rental.start_date as string).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        "DURASI SEWA": `${rental.duration_months} Bulan`,
        "TANGGAL SELESAI": new Date(rental.end_date as string).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        status:
          rental.status === "pending" ? "Menunggu" : rental.status === "active" ? "Aktif" : rental.status === "finished" ? "Selesai" : "Dibatalkan",
      }
    })
  )

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading="Penyewaan" description="Pusat data pengguna untuk melihat, menambah, atau mengelola akun." />
        <Flex gap={10}>
          <ExportPDF
            data={rentalsReport}
            filename={`rentals${keywords ? `-${keywords}` : ""}.pdf`}
            title={`Rekap Data Penyewaan${keywords ? ` (filter: ${keywords})` : ""}`}
          />
          <ExportCSV
            data={rentalsReport}
            filename={`rentals${keywords ? `-${keywords}` : ""}.csv`}
            title={`Rekap Data Penyewaan${keywords ? ` (filter: ${keywords})` : ""}`}
          />
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
          {asc(filteredRentals, FIELD_ID)?.map(async (rental: Rental, i: number) => {
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
