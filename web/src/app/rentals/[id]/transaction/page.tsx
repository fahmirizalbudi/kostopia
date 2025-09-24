import NavigationBar from "@/app/components/layout/NavigationBar"
import { menuNavigationBar } from "@/app/menu/navigation-bar"
import styles from "./page.module.scss"
import Flex from "@/app/components/layout/Flex"
import Break from "@/app/admin/components/Break"
import PaymentMethod from "./components/PaymentMethod"
import { findRental } from "@/app/data-access/rentals"
import Summary from "./components/Summary"

type TransactionProps = {
  params: { id: string }
}

const Transaction = async ({ params }: TransactionProps) => {
  const rental = await findRental({
    where: Number(params.id),
  })

  return (
    <main>
      <NavigationBar menu={menuNavigationBar} />
      <div className={styles.container}>
        <Flex className={styles.header}>
          <span className={styles.titleSection}>Transaksi</span>
        </Flex>
        <Break height={30} />
        <Flex className={styles.divider}>
          <Flex className={styles.paymentMethod}>
            <span className={styles.subTitle}>Metode Pembayaran</span>
            <PaymentMethod />
          </Flex>
          <Flex className={styles.summary}>
            <span className={styles.subTitle}>Rincian</span>
            <Summary {...rental} />
          </Flex>
        </Flex>
      </div>
    </main>
  )
}

export default Transaction
