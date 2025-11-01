"use client"

import Button from "./Button"
import styles from "./Export.module.scss"

type ExportCSVProps = {
  data?: any[]
  filename?: string
  title?: string
  btnName?: string
}

const ExportCSV = ({ btnName = "Export CSV", data, filename = "data.csv", title = "Data Tabel" }: ExportCSVProps) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diexport!")
      return
    }

    const keys = Object.keys(data[0]).filter((key) => !["created_at", "updated_at"].includes(key))

    const headerTitle = [`"${title}"`, "", ""].join(",")
    const dateRow = [`"Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}"`, "", ""].join(",")

    const csvHeader = keys.map((key) => `"${key.replace(/_/g, " ").toUpperCase()}"`).join(",")

    const csvRows = data.map((item) =>
      keys
        .map((key) => {
          let val = item[key]
          if (val === null || val === undefined || val === "") return "-"
          if (typeof val === "object") val = JSON.stringify(val)
          return `"${String(val).replace(/"/g, '""')}"`
        })
        .join(",")
    )

    const csvContent = ["\uFEFF", headerTitle, dateRow, "", csvHeader, ...csvRows].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.click()
  }

  return (
    <Button className={styles.csv} onClick={handleExport}>
      {btnName}
    </Button>
  )
}

export default ExportCSV
