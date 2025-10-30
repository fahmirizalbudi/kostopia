import Button from "./Button"
import styles from "./Export.module.scss"

type ExportPDFProps = {
  onExport?: () => void
}

const ExportPDF = ({ onExport }: ExportPDFProps) => {
  return (
    <Button className={styles.pdf} onClick={onExport}>
      Export PDF
    </Button>
  )
}

export default ExportPDF
