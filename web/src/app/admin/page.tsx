import { getServerSession } from "next-auth"
import { fetchTransactions } from "../data-access/transactions"
import Break from "./components/Break"
import Cumbs from "./components/Cumbs"
import SafeView from "./components/SafeView"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { transformDataForTransactionMonthChart, transformRentalsToMonthlyData } from "../utils/utils"
import { TransactionMonthChart } from "./components/TransactionMonthChart"
import Flex from "../components/layout/Flex"
import styles from "./page.module.scss"
import { RentalMonthChart } from "./components/RentalMonthChart"
import { fetchRentals } from "../data-access/rentals"
import { SummaryCard } from "./components/SummaryCard"
import { Icon } from "./components/Icon"
import { OverviewTable } from "./components/OverviewTable"

const Beranda = async () => {
  const session = await getServerSession(authOptions)
  const rentals = await fetchRentals({
    accessToken: session?.accessToken as string,
  })
  const transactions = await fetchTransactions({
    accessToken: session?.accessToken as string,
  })

  const rentalData = transformRentalsToMonthlyData(rentals)
  const transactionData = transformDataForTransactionMonthChart(transactions)

  return (
    <SafeView>
      <Cumbs heading="Beranda" description="Halaman utama aplikasi yang menampilkan ringkasan informasi." />
      <Break height={30} />
      <div className={styles.summaryGrid}>
        <SummaryCard title="Total Kos" value="5" color="blue" icon={Icon.HOME} />
        <SummaryCard title="Total Kamar" value="60" color="green" icon={Icon.BED} />
        <SummaryCard title="Kamar Tersedia" value="15" color="orange" icon={Icon.UNLOCK} />
        <SummaryCard title="Kamar Terisi" value="45" color="teal" icon={Icon.LOCK} />
        <SummaryCard title="Pendapatan Bulan Ini" value="Rp 6.000.000" color="purple" icon={Icon.WALLET} />
      </div>
      <Break height={30} />
      <Flex className={styles.charts}>
        <TransactionMonthChart data={transactionData} />
        <RentalMonthChart data={rentalData} />
      </Flex>
      <Break height={30} />
      <OverviewTable data={transactions} />
    </SafeView>
  )
}

export default Beranda
