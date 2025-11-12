"use client"

import { ReactNode, useEffect } from "react"
import styles from "./ImagePopup.module.scss"

type ImagePopUpProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  fullscreen?: boolean
}

export const ImagePopUp = ({ isOpen, onClose, children, fullscreen = false }: ImagePopUpProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "scroll"
    }

    return () => {
      document.body.style.overflow = "scroll"
    }
  }, [isOpen])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${fullscreen ? styles.fullscreen : ""}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
