"use client"

import { useRef } from "react"
import styles from "./DatePicker.module.scss"

interface DatePickerProps {
  placeholder?: string
  value: String
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const DatePicker = ({ placeholder = "Pilih tanggal ...", value, onChange }: DatePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.showPicker()
  }

  return (
    <div className={`${styles.datePicker} ${value ? styles.hasValue : ""}`} onClick={handleClick}>
      <input type="date" value={String(value)} onChange={onChange} onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.blur()} ref={inputRef} />
      <span className={styles.placeholder}>{value || placeholder}</span>
    </div>
  )
}

export default DatePicker
