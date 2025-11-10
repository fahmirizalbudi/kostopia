"use client"

import { useEffect, useState } from "react"
import styles from "./Modal.module.scss"

type ModalProps = {
  title: string
  isOpen: Boolean
  children?: React.ReactNode
  onClose: () => void
  maxContent?: number
}

export const Modal = ({ title, isOpen, children, onClose, maxContent }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "scroll"
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = "scroll"
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.active : ""}`}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.closeButton} onClick={onClose}>
            ×
          </span>
        </header>
        <main className={styles.content} style={{ maxHeight: maxContent ?? 'auto' }}>{children}</main>
      </div>
    </div>
  )
}
