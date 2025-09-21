import styles from "./DatePicker.module.scss"
import Image from "next/image"
import { asset } from "@/app/lib/asset"
import { FormEvent } from "react"

interface DatePickerProps {
  placeholder?: string
  value: String
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const DatePicker = ({ placeholder = "Pilih tanggal ...", value, onChange }: DatePickerProps) => {
  return (
    <div className={`${styles.datePicker} ${value ? styles.hasValue : ""}`}>
      <input type="date" value={String(value)} onChange={onChange} onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.blur()} />
      <span className={styles.placeholder}>{value || placeholder}</span>
    </div>
  )
}

export default DatePicker
