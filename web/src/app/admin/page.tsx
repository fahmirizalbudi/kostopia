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

const Beranda = async () => {
  const session = await getServerSession(authOptions)
  const rentals = await fetchRentals({
    accessToken: session?.accessToken as string
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
      <Flex className={styles.charts}>
        <TransactionMonthChart data={transactionData} />
        <RentalMonthChart data={rentalData} />
      </Flex>
    </SafeView>
  )
}

export default Beranda
