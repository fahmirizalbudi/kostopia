import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import Cumbs from "../components/Cumbs"
import SafeView from "../components/SafeView"
import styles from "./page.module.scss"
import Break from "../components/Break"
import Flex from "@/app/components/layout/Flex"
import ExportPDF from "@/app/components/ui/ExportPDF"
import ExportCSV from "@/app/components/ui/ExportCSV"
import { API } from "@/app/constants/api"
import { rupiah } from "@/app/utils/utils"

type ReportProps = {
  searchParams?: {
    start_date?: string
    end_date?: string
  }
}

const Report = async ({ searchParams }: ReportProps) => {
  const reportRes = await fetch(`${API}/report`, {
    cache: "no-store",
  })
  const reportJSON = await reportRes.json()
  const report = reportJSON.data

  const startDate = searchParams?.start_date
  const endDate = searchParams?.end_date

  const filteredReport = report.filter((report: any) => {
    if (!startDate && !endDate) return true
    const date = new Date(report.date)
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null
    if (start && date < start) return false
    if (end && date > end) return false
    return true
  })

  const formattedReport = report.map((report: any) => ({
    "TANGGAL TRANSAKSI": new Date(report.date as string).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    penyewa: report.tenant,
    "KAMAR / UNIT": report.unit,
    "DURASI SEWA": `${report.month_paid} Bulan`,
    "TANGGAL MULAI": new Date(report.start_date as string).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    "TANGGAL SELESAI": new Date(report.end_date as string).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    "JENIS TRANSAKSI": report.purpose,
    jumlah: rupiah(report.amount),
    "METODE PEMBAYARAN": report.method === "ewallet" ? "E-Wallet" : report.method === "transfer" ? "Transfer" : "Cash",
  }))

  const formattedFilteredReport = filteredReport.map((report: any) => ({
    "TANGGAL TRANSAKSI": new Date(report.date as string).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    penyewa: report.tenant,
    "KAMAR / UNIT": report.unit,
    "DURASI SEWA": `${report.month_paid} Bulan`,
    "TANGGAL MULAI": new Date(report.start_date as string).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    "TANGGAL SELESAI": new Date(report.end_date as string).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    "JENIS TRANSAKSI": report.purpose,
    jumlah: rupiah(report.amount),
    "METODE PEMBAYARAN": report.method === "ewallet" ? "E-Wallet" : report.method === "transfer" ? "Transfer" : "Cash",
  }))

  const filterInfo =
    startDate || endDate
      ? `Periode: ${startDate ? new Date(startDate).toLocaleDateString("id-ID") : "–"} s/d ${
          endDate ? new Date(endDate).toLocaleDateString("id-ID") : "–"
        }`
      : "Semua data (tanpa filter)"

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading="Laporan" description="Menampilkan data penyewaan dan transaksi yang berhasil untuk memantau pendapatan." />
        <Flex gap={10}>
          <ExportPDF
            data={formattedFilteredReport}
            filename="filtered_report.pdf"
            title={filterInfo}
            btnName="Export PDF by Filter"
          />
          <ExportCSV
            data={formattedFilteredReport}
            filename="filtered_report.csv"
            title={filterInfo}
            btnName="Export CSV by Filter"
          />
          <ExportPDF data={formattedReport} filename="report.pdf" title="Rekap Laporan Penyewaan Transaksi" />
          <ExportCSV data={formattedReport} filename="report.csv" title="Rekap Laporan Penyewaan Transaksi" />
        </Flex>
      </Flex>
      <Break height={30} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>TANGGAL TRANSAKSI</TableHead>
            <TableHead>PENYEWA</TableHead>
            <TableHead>KAMAR / UNIT</TableHead>
            <TableHead>DURASI SEWA</TableHead>
            <TableHead>TANGGAL MULAI</TableHead>
            <TableHead>TANGGAL SELESAI</TableHead>
            <TableHead>JENIS TRANSAKSI</TableHead>
            <TableHead>JUMLAH</TableHead>
            <TableHead>METODE PEMBAYARAN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReport.map((report: any, i: number) => (
            <TableRow key={i}>
              <TableCell>
                {new Date(report.date as string).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>{report.tenant}</TableCell>
              <TableCell>{report.unit}</TableCell>
              <TableCell>{report.month_paid} Bulan</TableCell>
              <TableCell>
                {new Date(report.start_date as string).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>
                {new Date(report.end_date as string).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>{report.purpose}</TableCell>
              <TableCell>{rupiah(report.amount)}</TableCell>
              <TableCell>
                <span className={styles.method}>{report.method === "ewallet" ? "E-Wallet" : report.method === "transfer" ? "Transfer" : "Cash"}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SafeView>
  )
}

export default Report
