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
import { fetchTransactions } from "@/app/data-access/transactions"
import { Transaction } from "@/app/types/transaction"
import TransactionProof from "./components/TransactionProof"
import TransactionIsSuccess from "./components/TransactionIsSuccess"
import TransactionReceipt from "./components/TransactionReceipt"
import TransactionInformation from "./components/TransactionInformation"
import TransactionReject from "./components/TransactionReject"
import ExportCSV from "@/app/components/ui/ExportCSV"
import ExportPDF from "@/app/components/ui/ExportPDF"

type TransactionsProps = {
  searchParams?: {
    keywords?: string
    start_date?: string
    end_date?: string
  }
}

const Transactions = async ({ searchParams }: TransactionsProps) => {
  const session = await getServerSession(authOptions)
  const transactions = await fetchTransactions({
    accessToken: session?.accessToken as string,
  })

  const keywords = searchParams?.keywords?.toLowerCase()
  let filteredTransactions = filter<Transaction>().fromData(transactions).byKeywords(keywords).get()

  const startDate = searchParams?.start_date
  const endDate = searchParams?.end_date

  filteredTransactions = filteredTransactions?.filter((transaction: any) => {
    if (!startDate && !endDate) return true

    const date = new Date(transaction.created_at)
    const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()) // hapus jam

    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null
    const startDay = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null
    const endDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : null

    if (startDay && transactionDate < startDay) return false
    if (endDay && transactionDate > endDay) return false
    return true
  })

  const transactionsReport = filteredTransactions?.map((transaction: Transaction) => ({
    kode: transaction.id,
    "HARGA KOS": transaction.dormitory_price,
    "PEMBAYARAN BULAN": `${transaction.month_paid} Bulan`,
    keperluan: transaction.purpose === "new" ? "Sewa Baru" : "Perpanjang Sewa",
    jumlah: transaction.amount,
    "METODE PEMBAYARAN": transaction.method === "ewallet" ? "E-Wallet" : transaction.method === "transfer" ? "Transfer" : "Cash",
    status:
      transaction.status === "no_transaction"
        ? "-"
        : transaction.status === "success"
        ? "Lunas"
        : transaction.status === "rejected"
        ? "Ditolak"
        : "Menunggu",
  }))

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading="Transaksi" description="Pusat data pengguna untuk melihat, menambah, atau mengelola akun." />
        <Flex gap={10}>
          <ExportPDF
            data={transactionsReport}
            filename={`transactions${keywords ? `-${keywords}` : ""}${startDate || endDate ? `-${startDate || ""}_to_${endDate || ""}` : ""}.pdf`}
            title={`Rekap Data Transaksi${keywords ? ` (kata kunci: ${keywords})` : ""}${
              startDate || endDate ? ` (${startDate || "?"} s.d. ${endDate || "?"})` : ""
            }`}
          />
          <ExportCSV
            data={transactionsReport}
            filename={`transactions${keywords ? `-${keywords}` : ""}${startDate || endDate ? `-${startDate || ""}_to_${endDate || ""}` : ""}.csv`}
            title={`Rekap Data Transaksi${keywords ? ` (kata kunci: ${keywords})` : ""}${
              startDate || endDate ? ` (${startDate || "?"} s.d. ${endDate || "?"})` : ""
            }`}
          />
        </Flex>
      </Flex>
      <Break height={30} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>KODE</TableHead>
            <TableHead>HARGA KOS</TableHead>
            <TableHead>PEMBAYARAN BULAN</TableHead>
            <TableHead>JUMLAH</TableHead>
            <TableHead>METODE PEMBAYARAN</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asc(filteredTransactions, FIELD_ID)?.map(async (transaction: Transaction, i: number) => (
            <TableRow key={transaction.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.dormitory_price?.toLocaleString("id-ID")}</TableCell>
              <TableCell>{transaction.month_paid} Bulan</TableCell>
              <TableCell>{transaction.amount?.toLocaleString("id-ID")}</TableCell>
              <TableCell>
                <span className={styles.paymentMethod}>
                  {transaction.method === "ewallet" ? "E-Wallet" : transaction.method === "transfer" ? "Transfer" : "Cash"}
                </span>
              </TableCell>
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
              <TableCell className={styles.actions}>
                <TransactionInformation {...transaction} />
                {transaction.status === "success" && <TransactionReceipt {...transaction} />}
                {transaction.method === "transfer" && <TransactionProof {...transaction} />}
                {(transaction.method === "cash" || transaction.method === "transfer") && transaction.status === "pending" && (
                  <>
                    <TransactionReject {...transaction} />
                    <TransactionIsSuccess {...transaction} />
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SafeView>
  )
}

export default Transactions
