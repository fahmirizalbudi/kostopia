"use client"

import { useState } from "react"
import { Modal } from "@/app/components/ui/Modal"
import FormAction from "@/app/components/forms/FormAction"
import styles from "../page.module.scss"
import Image from "next/image"

const PreviewModal = ({ imageSrc, imageTitle }: { imageSrc: string; imageTitle: string }) => {
  const [isOpen, setIsOpen] = useState<Boolean>(false)

  const toggleOpen = () => {
    return setIsOpen(!isOpen)
  }

  return (
    <>
      <span className={styles.link} onClick={toggleOpen}>
        {imageTitle}
      </span>
      <Modal title={imageTitle} isOpen={isOpen} onClose={toggleOpen}>
        <figure className={styles.imagePreview}>
          <Image src={imageSrc} alt={imageTitle} fill />
        </figure>
      </Modal>
    </>
  )
}

export default PreviewModal
