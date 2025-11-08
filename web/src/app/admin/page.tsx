import { getServerSession } from "next-auth"
import { fetchTransactions } from "../data-access/transactions"
import Break from "./components/Break"
import Cumbs from "./components/Cumbs"
import SafeView from "./components/SafeView"
import { authOptions } from "../api/auth/[...nextauth]/auth-option"
import { calculateRevenue, rupiah, transformDataForTransactionMonthChart, transformRentalsToMonthlyData } from "../utils/utils"
import { TransactionMonthChart } from "./components/TransactionMonthChart"
import Flex from "../components/layout/Flex"
import styles from "./page.module.scss"
import { RentalMonthChart } from "./components/RentalMonthChart"
import { fetchRentals } from "../data-access/rentals"
import { SummaryCard } from "./components/SummaryCard"
import { Icon } from "./components/Icon"
import { OverviewTable } from "./components/OverviewTable"
import { fetchDormitories } from "../data-access/dormitories"
import { fetchRooms } from "../data-access/rooms"

const Beranda = async () => {
  const session = await getServerSession(authOptions)
  const rentals = await fetchRentals({
    accessToken: session?.accessToken as string,
  })
  const transactions = await fetchTransactions({
    accessToken: session?.accessToken as string,
  })
  const dormitories = await fetchDormitories()
  const rooms = await fetchRooms({
    accessToken: session?.accessToken as string
  })

  const rentalData = transformRentalsToMonthlyData(rentals)
  const transactionData = transformDataForTransactionMonthChart(transactions)

  const dormitoriesCount = dormitories.length
  const roomsCount = rooms.length
  const roomsAvailableCount = rooms.filter(room => room.status === "available").length
  const roomsRentedCount = rooms.filter(room => room.status === "rented").length
  const revenue: number = calculateRevenue(transactions)
  const formattedRevenue = rupiah(revenue)

  return (
    <SafeView>
      <Cumbs heading="Beranda" description="Halaman utama aplikasi yang menampilkan ringkasan informasi." />
      <Break height={30} />
      <div className={styles.summaryGrid}>
        <SummaryCard title="Total Kos" value={dormitoriesCount} color="blue" icon={Icon.HOME} />
        <SummaryCard title="Total Kamar" value={roomsCount} color="green" icon={Icon.BED} />
        <SummaryCard title="Kamar Tersedia" value={roomsAvailableCount} color="orange" icon={Icon.UNLOCK} />
        <SummaryCard title="Kamar Terisi" value={roomsRentedCount} color="teal" icon={Icon.LOCK} />
        <SummaryCard title="Pendapatan Bulan Ini" value={formattedRevenue} color="purple" icon={Icon.WALLET} />
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
