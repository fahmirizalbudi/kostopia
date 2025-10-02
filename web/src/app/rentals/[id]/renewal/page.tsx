import NavigationBar from "@/app/components/layout/NavigationBar"
import { menuNavigationBar } from "@/app/menu/navigation-bar"
import styles from "./page.module.scss"
import Flex from "@/app/components/layout/Flex"
import Break from "@/app/admin/components/Break"
import { findRental } from "@/app/data-access/rentals"
import Summary from "./components/Summary"
import PaymentMethod from "./components/PaymentMethod"
import { DataProvider } from "./contexts/DataProvider"

type RenewalProps = {
  params: { id: string }
}

const Renewal = async ({ params }: RenewalProps) => {
  const rental = await findRental({
    where: Number(params.id),
  })

  return (
    <DataProvider>
      <main>
        <NavigationBar menu={menuNavigationBar} />
        <div className={styles.container}>
          <Flex className={styles.header}>
            <span className={styles.titleSection}>Checkout</span>
          </Flex>
          <Break height={30} />
          <Flex className={styles.divider}>
            <Flex className={styles.paymentMethod}>
              <span className={styles.subTitle}>Metode Pembayaran</span>
              <PaymentMethod />
            </Flex>
            <Flex className={styles.summary}>
              <span className={styles.subTitle}>Rincian</span>
              <Summary rental={rental} />
            </Flex>
          </Flex>
        </div>
      </main>
    </DataProvider>
  )
}

export default Renewal
