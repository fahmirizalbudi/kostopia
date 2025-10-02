import React from "react"
import NavigationBar from "../components/layout/NavigationBar"
import { menuNavigationBar } from "../menu/navigation-bar"
import Flex from "../components/layout/Flex"
import Image from "next/image"
import { asset } from "../lib/asset"
import styles from "./page.module.scss"
import Break from "../admin/components/Break"
import RentalList from "./components/RentalList"
import { getMyRentals } from "../data-access/rentals"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import Tabs from "../components/ui/Tabs"
import { historyTabItems } from "../menu/history-tab"

const Rentals = async () => {
  const session = await getServerSession(authOptions)
  const rentals = await getMyRentals({
    accessToken: String(session?.accessToken),
  })

  return (
    <main>
      <NavigationBar menu={menuNavigationBar} />
      <section className={styles.container}>
        <Flex className={styles.header}>
          <span className={styles.titleSection}>Histori</span>
          <Flex className={styles.decorations}>
            {/* <Image alt="Decoration" width={40} height={40} src={asset("deco_02.svg")} className={styles.decoration} />
            <Image alt="Decoration" width={40} height={40} src={asset("deco.svg")} className={styles.decoration} /> */}
            <Tabs items={historyTabItems} />
          </Flex>
        </Flex>
        <Break height={30} />
        <Flex className={styles.rentals}>
          {rentals?.map((rental) => (
            <RentalList {...rental} key={rental.id} />
          ))}
        </Flex>
      </section>
    </main>
  )
}

export default Rentals
