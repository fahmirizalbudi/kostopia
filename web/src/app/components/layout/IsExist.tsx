import { TableCell, TableRow } from "@/app/admin/components/Table"
import styles from "./IsExist.module.scss"

type IsExistProps = {
  arr: any[]
  children: React.ReactNode
  customColSpan?: number
}

const IsExist = ({ arr, children, customColSpan = 6 }: IsExistProps) => {
  return (
    <>
      {arr.length === 0 ? (
        <TableRow>
          <TableCell colSpan={customColSpan}>
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
