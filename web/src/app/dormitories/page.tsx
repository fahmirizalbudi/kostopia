import Image from "next/image"
import Break from "../admin/components/Break"
import Flex from "../components/layout/Flex"
import NavigationBar from "../components/layout/NavigationBar"
import { asset } from "../lib/asset"
import { menuNavigationBar } from "../menu/navigation-bar"
import styles from "./page.module.scss"
import Grid from "../components/layout/Grid"
import FilterDormitory from "./components/FilterDormitory"
import { fetchDormitoriesWithPreviews } from "../data-access/dormitories"
import { asc } from "../utils/utils"
import { FIELD_ID } from "../constants/field"
import { Dormitory } from "../types/dormitory"
import DormitoryCard from "./components/DormitoryCard"
import DormitoryList from "./components/DormitoryList"

type DormitoriesProps = {
  searchParams?: {
    type?: string
  }
}

const Dormitories = async ({ searchParams }: DormitoriesProps) => {
  const dormitoriesWithPreviews = await fetchDormitoriesWithPreviews()

  return (
    <main>
      <NavigationBar menu={menuNavigationBar} />
      <section className={styles.container}>
        <Flex className={styles.header}>
          <span className={styles.titleSection}>Cari Kos</span>
          <Flex className={styles.decorations}>
            <Image alt="Decoration" width={40} height={40} src={asset("deco_02.svg")} className={styles.decoration} />
            <Image alt="Decoration" width={40} height={40} src={asset("deco.svg")} className={styles.decoration} />
          </Flex>
        </Flex>
        <Break height={30} />
        <FilterDormitory />
        <Break height={30} />
        {searchParams?.type === "list" ? (
          <Flex className={styles.dormitoriesList}>
            {asc(dormitoriesWithPreviews, FIELD_ID)?.map((dormitoriesWithPreview: Dormitory, i: number) => (
              <DormitoryList {...dormitoriesWithPreview} />
            ))}
          </Flex>
        ) : (
          <Grid className={styles.dormitories}>
            {asc(dormitoriesWithPreviews, FIELD_ID)?.map((dormitoriesWithPreview: Dormitory, i: number) => (
              <DormitoryCard {...dormitoriesWithPreview} />
            ))}
          </Grid>
        )}
      </section>
    </main>
  )
}

export default Dormitories
