import SafeView from "@/app/admin/components/SafeView"
import Flex from "@/app/components/layout/Flex"
import { fetchDormitoryPreviews } from "@/app/data-access/dormitory-previews"
import styles from "./page.module.scss"
import Cumbs from "@/app/admin/components/Cumbs"
import Break from "@/app/admin/components/Break"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/admin/components/Table"
import { asc } from "@/app/utils/utils"
import { DormitoryPreview } from "@/app/types/dormitory-preview"
import { FIELD_ID } from "@/app/constants/field"
import Link from "next/link"
import DeleteDormitoryPreview from "./components/DeleteDormitoryPreview"
import AddDormitoryPreview from "./components/AddDormitoryPreview"

type PreviewsProps = {
  params?: { id: string }
}

const Previews = async ({ params }: PreviewsProps) => {
  const dormitoryPreviews = await fetchDormitoryPreviews({
    where: Number(params?.id),
  })
  const dormitoryPreview: DormitoryPreview = { id: Number(params?.id) }

  return (
    <SafeView>
      <Flex className={styles.header}>
        <Cumbs heading={`Kos Preview [${params?.id}]`} description={`Manajemen previews kos berdasarkan kos id ${params?.id}.`} />
        <AddDormitoryPreview {...dormitoryPreview} />
      </Flex>
      <Break height={30} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>PREVIEW</TableHead>
            <TableHead>AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asc(dormitoryPreviews, FIELD_ID)?.map((dormitoryPreview: DormitoryPreview, i: number) => (
            <TableRow key={dormitoryPreview.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                <Link className={styles.link} href={String(dormitoryPreview.url)}>
                  Kos Preview {i + 1}
                </Link>
              </TableCell>
              <TableCell className={styles.actions}>
                <DeleteDormitoryPreview {...dormitoryPreview} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SafeView>
  )
}

export default Previews
