import { Transaction } from "@/app/types/transaction"
import styles from "./OverviewTable.module.scss"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table"
import { findDormitory } from "@/app/data-access/dormitories"
import { rupiah } from "@/app/utils/utils"

type OverviewTableProps = {
  data: any
}

export const OverviewTable = ({ data }: OverviewTableProps) => {
  const transactions: Transaction[] = data
    ?.sort(
      (a: { createdAt: string | number | Date }, b: { createdAt: string | number | Date }) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Transaksi Terakhir</h3>
        <p className={styles.description}>Rekap transaksi berdasarkan waktu yang paling akhir.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>PENYEWA</TableHead>
            <TableHead>KOS</TableHead>
            <TableHead>KAMAR</TableHead>
            <TableHead>TANGGAL</TableHead>
            <TableHead>JUMLAH</TableHead>
            <TableHead>STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map(async (transaction: Transaction, i: number) => {
            const dormitory = await findDormitory({
              where: transaction.rental?.room?.dormitory_id as number,
            })

            return (
              <TableRow>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{transaction.rental?.tenant?.name}</TableCell>
                <TableCell>{dormitory.name}</TableCell>
                <TableCell>{transaction.rental?.room?.room_number}</TableCell>
                <TableCell>
                  {new Date(transaction.created_at as string).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>{rupiah(transaction.amount as number)}</TableCell>
                <TableCell>
                  <span
                    className={
                      transaction.status === "pending"
                        ? styles.statusPending
                        : transaction.status === "success"
                        ? styles.statusPaid
                        : transaction.status === "rejected"
                        ? styles.statusCanceled
                        : ""
                    }
                  >
                    {transaction.status === "no_transaction"
                      ? "-"
                      : transaction.status === "success"
                      ? "Lunas"
                      : transaction.status === "rejected"
                      ? "Ditolak"
                      : "Menunggu"}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
