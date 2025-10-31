"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import Button from "./Button"
import styles from "./Export.module.scss"

type ExportPDFProps = {
  data: any[]
  filename?: string
  title?: string
}

const ExportPDF = ({ data, filename = "data.pdf", title = "Data Tabel" }: ExportPDFProps) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diexport!")
      return
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text(title, 105, 15, { align: "center" })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const today = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    doc.text(`Tanggal: ${today}`, 14, 25)

    const keys = Object.keys(data[0]).filter((key) => !["created_at", "updated_at"].includes(key))

    const head = [["#", ...keys.map((key) => key.replace(/_/g, " ").toUpperCase())]]

    const body = data.map((item, index) => [
      index + 1,
      ...keys.map((key) => {
        const value = item[key]
        if (value === null || value === undefined || value === "") return "-"
        if (typeof value === "object") return JSON.stringify(value)
        return String(value)
      }),
    ])

    autoTable(doc, {
      startY: 30,
      head,
      body,
      theme: "plain",
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 4,
        halign: "left",
        valign: "middle",
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "normal",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {},
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
      },
      margin: { top: 25, left: 14, right: 14, bottom: 10 },
    })

    doc.save(filename)
  }

  return (
    <Button className={styles.pdf} onClick={handleExport}>
      Export PDF
    </Button>
  )
}

export default ExportPDF
