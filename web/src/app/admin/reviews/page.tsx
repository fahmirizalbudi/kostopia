import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import Cumbs from "../components/Cumbs"
import SafeView from "../components/SafeView"
import styles from "./page.module.scss"
import Break from "../components/Break"
import Flex from "@/app/components/layout/Flex"
import { fetchReviews } from "@/app/data-access/reviews"
import { filter } from "@/app/utils/utils"
import IsExist from "@/app/components/layout/IsExist"

type ReviewsProps = {
  searchParams?: {
    keywords?: string
  }
}

const Reviews = async ({ searchParams }: ReviewsProps) => {
  const reviews = await fetchReviews()

  const keywords = searchParams?.keywords
  const filteredReviews = filter<typeof reviews>().fromData(reviews).byKeywords(keywords).get()

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading="Ulasan" description="Pusat data ulasan pengguna yang memuat penilaian dan tanggapan terhadap layanan." />
      </Flex>
      <Break height={30} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>PENYEWA</TableHead>
            <TableHead>KAMAR / UNIT</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead>KOMENTAR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <IsExist arr={filteredReviews}>
            {filteredReviews?.map((review: any, i: number) => (
              <TableRow>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{review.reviewer}</TableCell>
                <TableCell>{review.place}</TableCell>
                <TableCell>⭐ {review.rating}</TableCell>
                <TableCell>{review.comment}</TableCell>
              </TableRow>
            ))}
          </IsExist>
        </TableBody>
      </Table>
    </SafeView>
  )
}

export default Reviews
