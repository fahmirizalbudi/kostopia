import React from "react"
import styles from "./Table.module.scss"

type TableProps = {
  children: React.ReactNode
  className?: string
  colSpan?: number
}

export const Table = ({ children, className }: TableProps) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>
      <table className={`${styles.table} ${className || ""}`}>{children}</table>
    </div>
  )
}

export const TableHeader = ({ children, className }: TableProps) => <thead className={`${styles.thead} ${className || ""}`}>{children}</thead>

export const TableBody = ({ children, className }: TableProps) => <tbody className={`${styles.tbody} ${className || ""}`}>{children}</tbody>

export const TableRow = ({ children, className }: TableProps) => <tr className={`${styles.tr} ${className || ""}`}>{children}</tr>

export const TableHead = ({ children, className }: TableProps) => <th className={`${styles.th} ${className || ""}`}>{children}</th>

export const TableCell = ({ children, className, colSpan }: TableProps) => (
  <td colSpan={colSpan} className={`${styles.td} ${className || ""}`}>
    {children}
  </td>
)
