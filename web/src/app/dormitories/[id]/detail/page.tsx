import NavigationBar from "@/app/components/layout/NavigationBar"
import { menuNavigationBar } from "@/app/menu/navigation-bar"
import styles from "./page.module.scss"
import Flex from "@/app/components/layout/Flex"
import { findDormitory } from "@/app/data-access/dormitories"
import { fetchDormitoryPreviews } from "@/app/data-access/dormitory-previews"
import Break from "@/app/admin/components/Break"
import GridCarousels from "./components/GridCarousels"
import LeftSection from "./components/LeftSection"
import RightSection from "./components/RightSection"
import DetailHeader from "./components/DetailHeader"

type DormitoryDetailProps = {
  params: { id: string }
}

const DormitoryDetail = async ({ params }: DormitoryDetailProps) => {
  const dormitoryDetail = await findDormitory({
    where: Number(params.id),
  })

  const dormitoryPreviews = await fetchDormitoryPreviews({
    where: Number(params.id),
  })

  return (
    <main>
      <NavigationBar menu={menuNavigationBar} />
      <section className={styles.container}>
        <DetailHeader {...dormitoryDetail} />
        <Break height={30} />
        <GridCarousels dormitoryPreviews={dormitoryPreviews} />
        <Flex className={styles.mainContent}>
          <LeftSection {...dormitoryDetail} />
          <RightSection {...dormitoryDetail} />
        </Flex>
      </section>
    </main>
  )
}

export default DormitoryDetail
