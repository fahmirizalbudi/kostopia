import styles from "./SummaryCard.module.scss"

interface SummaryCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: "blue" | "green" | "orange" | "purple" | "teal"
}

export const SummaryCard = ({ title, value, icon, color = "blue" }: SummaryCardProps) => {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <h3 className={styles.value}>{value}</h3>
      </div>
    </div>
  )
}
