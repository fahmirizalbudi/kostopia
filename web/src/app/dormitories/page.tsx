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
import { Dormitory } from "../types/dormitory"
import DormitoryCard from "./components/DormitoryCard"
import DormitoryList from "./components/DormitoryList"
import { Option } from "../components/forms/ComboBox"
import Link from "next/link"
import Tooltip from "../components/ui/Tooltip"

type DormitoriesProps = {
  searchParams?: {
    type?: string
    keywords?: string
    facility?: string
    price?: string
    order?: string
  }
}

const Dormitories = async ({ searchParams }: DormitoriesProps) => {
  const dormitoriesWithPreviews = await fetchDormitoriesWithPreviews()
  let filteredDormitoriesWithPreviews = dormitoriesWithPreviews

  if (searchParams?.keywords) {
    const keywordLower = searchParams.keywords.toLowerCase()
    filteredDormitoriesWithPreviews = filteredDormitoriesWithPreviews.filter((dormitory: Dormitory) =>
      dormitory?.name?.toLowerCase().includes(keywordLower)
    )
  }
  if (searchParams?.facility) {
    const facilityLower = searchParams.facility.toLowerCase()
    filteredDormitoriesWithPreviews = filteredDormitoriesWithPreviews.filter((dormitory: Dormitory) =>
      dormitory?.facilities?.toLowerCase().includes(facilityLower)
    )
  }

  if (searchParams?.price) {
    const [minPriceStr, maxPriceStr] = searchParams?.price.split("|")
    const minPrice = Number(minPriceStr)
    const maxPrice = Number(maxPriceStr)

    filteredDormitoriesWithPreviews = filteredDormitoriesWithPreviews.filter((dormitory: Dormitory) => {
      return Number(dormitory.price) >= minPrice && Number(dormitory.price) <= maxPrice
    })
  }

  if (searchParams?.order) {
    switch (searchParams?.order) {
      case "price_asc":
        filteredDormitoriesWithPreviews = filteredDormitoriesWithPreviews.sort(
          (current: Dormitory, next: Dormitory) => Number(current.price) - Number(next.price)
        )
        break
      case "price_desc":
        filteredDormitoriesWithPreviews = filteredDormitoriesWithPreviews.sort(
          (current: Dormitory, next: Dormitory) => Number(next.price) - Number(current.price)
        )
        break
      case "name_asc":
        filteredDormitoriesWithPreviews = filteredDormitoriesWithPreviews.sort((current: Dormitory, next: Dormitory) =>
          current.name?.localeCompare(next.name as string)
        )
        break
      case "name_desc":
        filteredDormitoriesWithPreviews = filteredDormitoriesWithPreviews.sort((current: Dormitory, next: Dormitory) =>
          next.name?.localeCompare(current.name as string)
        )
        break
      default:
        break
    }
  }

  let rawFacilities: string[] = []
  for (const dormitory of dormitoriesWithPreviews) {
    const facilities = dormitory.facilities.split(",")
    for (const facility of facilities) {
      rawFacilities.push(facility)
    }
  }

  const arrayFacilities = Array.from(new Set(rawFacilities))

  const facilities: Option[] = arrayFacilities.map((facility) => ({
    value: facility.toLowerCase(),
    label: facility.charAt(0).toUpperCase() + facility.slice(1),
  }))

  let prices: Option[] = []
  const rawPrices = dormitoriesWithPreviews.map((dormitory: Dormitory) => dormitory.price)
  const minPrice = Math.min(...rawPrices)
  const maxPrice = Math.max(...rawPrices)
  const midPrice = Math.floor((minPrice + maxPrice) / 2)
  prices = [
    { value: `${minPrice}|${midPrice}`, label: `${minPrice.toLocaleString()} - ${midPrice.toLocaleString()}` },
    { value: `${midPrice + 1}|${maxPrice}`, label: `${(midPrice + 1).toLocaleString()} - ${maxPrice.toLocaleString()}` },
  ]

  return (
    <main>
      <NavigationBar menu={menuNavigationBar} />
      <section className={styles.container}>
        <Flex className={styles.header}>
          <span className={styles.titleSection}>Cari Kos</span>
          <Flex className={styles.decorations}>
            <Tooltip text="Ganti ke tampilan daftar">
              <Link href="/dormitories?type=list">
                <Image
                  alt="Decoration"
                  width={40}
                  height={40}
                  src={asset(searchParams?.type === "list" ? "deco_02_active.svg" : "deco_02.svg")}
                  className={styles.decoration}
                />
              </Link>
            </Tooltip>
            <Tooltip text="Ganti ke tampilan grid">
              <Link href="/dormitories">
                <Image
                  alt="Decoration"
                  width={40}
                  height={40}
                  src={asset(searchParams?.type === undefined ? "deco_active.svg" : "deco.svg")}
                  className={styles.decoration}
                />
              </Link>
            </Tooltip>
          </Flex>
        </Flex>
        <Break height={30} />
        <FilterDormitory facilities={facilities} prices={prices} />
        <Break height={30} />
        {searchParams?.type === "list" ? (
          <Flex className={styles.dormitoriesList}>
            {filteredDormitoriesWithPreviews?.map((filteredDormitoriesWithPreviews: Dormitory, i: number) => (
              <DormitoryList {...filteredDormitoriesWithPreviews} key={i} />
            ))}
          </Flex>
        ) : (
          <Grid className={styles.dormitories}>
            {filteredDormitoriesWithPreviews?.map((filteredDormitoriesWithPreviews: Dormitory, i: number) => (
              <DormitoryCard {...filteredDormitoriesWithPreviews} key={i} />
            ))}
          </Grid>
        )}
      </section>
    </main>
  )
}

export default Dormitories
