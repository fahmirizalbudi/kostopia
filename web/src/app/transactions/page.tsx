import React from "react"
import NavigationBar from "../components/layout/NavigationBar"
import { menuNavigationBar } from "../menu/navigation-bar"
import Flex from "../components/layout/Flex"
import styles from "./page.module.scss"
import Break from "../admin/components/Break"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import Tabs from "../components/ui/Tabs"
import { historyTabItems } from "../menu/history-tab"
import { getMyTransactions } from "../data-access/transactions"
import TransactionList from "./components/TransactionList"

const Transactions = async () => {
  const session = await getServerSession(authOptions)
  const transactions = await getMyTransactions({
    accessToken: session?.accessToken as string,
  })

  return (
    <main>
      <NavigationBar menu={menuNavigationBar} />
      <section className={styles.container}>
        <Flex className={styles.header}>
          <span className={styles.titleSection}>Histori</span>
          <Flex className={styles.decorations}>
            <Tabs items={historyTabItems} />
          </Flex>
        </Flex>
        <Break height={30} />
        <Flex className={styles.transactions}>
          {transactions?.map((transaction) => (
            <TransactionList {...transaction} key={transaction.id} />
          ))}
        </Flex>
      </section>
    </main>
  )
}

export default Transactions
