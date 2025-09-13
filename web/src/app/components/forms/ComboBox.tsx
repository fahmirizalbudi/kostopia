import { useState, useEffect } from "react"
import styles from "./ComboBox.module.scss"
import Image from "next/image"
import { asset } from "@/app/lib/asset"

export type Option = {
  value: string
  label: string
}

type ComboBoxProps = {
  options: Option[]
  placeholder?: string
  name?: string
  value?: Option | null
  onChange?: (option: string) => void
  className?: string
}

export default function ComboBox({ options, placeholder = "Select...", value, onChange, name, className }: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Option | null>(value || null)

  useEffect(() => {
    setSelected(value || null)
  }, [value])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleSelect = (option: Option) => {
    setSelected(option)
    setIsOpen(false)
    onChange?.(option.value)
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <button name={name} type="button" className={styles.trigger} onClick={toggleDropdown} style={{ color: selected ? "#1b1b1b" : "#757575" }}>
        {selected ? selected.label : placeholder}
        <Image src={asset("dropdown.svg")} height={20} width={20} alt="Dropdown" />
      </button>

      {isOpen && (
        <ul className={styles.options}>
          {options.map((option) => (
            <li key={option.value} className={styles.option} onClick={() => handleSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
