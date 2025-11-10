"use client"

import Grid from "@/app/components/layout/Grid"
import styles from "../page.module.scss"
import { DormitoryPreview } from "@/app/types/dormitory-preview"
import Image from "next/image"
import { Modal } from "@/app/components/ui/Modal"
import { useState } from "react"
import Flex from "@/app/components/layout/Flex"

type GridCarouselsProps = {
  dormitoryPreviews: DormitoryPreview[]
}

const GridCarousels = ({ dormitoryPreviews }: GridCarouselsProps) => {
  const [isOpen, setIsOpen] = useState<Boolean>(false)

  const toggleOpen = () => {
    return setIsOpen(!isOpen)
  }

  return (
    <Grid className={`${styles.carousels} ${dormitoryPreviews.length === 1 ? "" : dormitoryPreviews.length === 2 ? styles.two : styles.more}`}>
      {dormitoryPreviews[0] && (
        <div className={`${styles.carousel} ${dormitoryPreviews.length > 2 ? styles.carouselBig : ""}`}>
          <Image src={dormitoryPreviews[0].url as string} alt="" fill />
        </div>
      )}

      {dormitoryPreviews[1] && (
        <div className={`${styles.carousel}`}>
          <Image src={dormitoryPreviews[1].url as string} alt="" fill />
        </div>
      )}

      {dormitoryPreviews[2] && (
        <div className={`${styles.carousel} ${styles.smallTop}`}>
          <Image src={dormitoryPreviews[2].url as string} alt="" fill />
        </div>
      )}

      {dormitoryPreviews.length >= 3 && (
        <>
          <div className={`${styles.carousel} ${styles.fullBottom}`} onClick={toggleOpen}>
            <Image src={dormitoryPreviews[3]?.url as string} alt="" fill />
            <span className={styles.overlay}>{dormitoryPreviews.length > 3 ? "+" + (dormitoryPreviews.length - 3) : "+0"}</span>
          </div>
          <Modal maxContent={500} title="Detail Preview" isOpen={isOpen} onClose={toggleOpen}>
            <Flex gap={30} className={styles.detailPreviewFlex}>
              {dormitoryPreviews.slice(3).map((dormitoryPreview: DormitoryPreview) => (
                <figure className={styles.imagePreview} key={dormitoryPreview.id}>
                  <Image src={String(dormitoryPreview.url)} alt={String(dormitoryPreview.id)} fill />
                </figure>
              ))}
            </Flex>
          </Modal>
        </>
      )}
    </Grid>
  )
}

export default GridCarousels
