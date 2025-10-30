import Button from "./Button"
import styles from "./Export.module.scss"

type ExportCSVProps = {
  onExport?: () => void
}

const ExportCSV = ({ onExport }: ExportCSVProps) => {
  return (
    <Button className={styles.csv} onClick={onExport}>
      Export CSV
    </Button>
  )
}

export default ExportCSV
