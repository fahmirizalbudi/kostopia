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
import { fetchTransactions } from "@/app/data-access/transactions"
import { Transaction } from "@/app/types/transaction"
import TransactionProof from "./components/TransactionProof"
import TransactionIsSuccess from "./components/TransactionIsSuccess"
import TransactionInvoice from "./components/TransactionInvoice"
import TransactionInformation from "./components/TransactionInformation"

const Transactions = async () => {
  const session = await getServerSession(authOptions)
  const transactions = await fetchTransactions({
    accessToken: session?.accessToken as string,
  })

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading="Transaksi" description="Pusat data pengguna untuk melihat, menambah, atau mengelola akun." />
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
          {asc(transactions, FIELD_ID)?.map(async (transaction: Transaction, i: number) => (
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
                {transaction.status === "success" && <TransactionInvoice {...transaction} />}
                {transaction.method === "transfer" && <TransactionProof {...transaction} />}
                {(transaction.method === "cash" || transaction.method === "transfer") && transaction.status === "pending" && (
                  <TransactionIsSuccess {...transaction} />
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
