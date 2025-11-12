import { TableCell, TableRow } from "@/app/admin/components/Table"
import styles from "./IsExist.module.scss"

type IsExistProps = {
  arr: any[]
  children: React.ReactNode
}

const IsExist = ({ arr, children }: IsExistProps) => {
  return (
    <>
      {arr.length !== 0 ? (
        <TableRow>
          <TableCell colSpan={6}>
            <p className={styles.notExist}>Tidak ada data yang tersedia.</p>
          </TableCell>
        </TableRow>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

export default IsExist
