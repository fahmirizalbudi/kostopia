"use client"

import Action from "@/app/components/forms/Action"
import FormAction from "@/app/components/forms/FormAction"
import { Modal } from "@/app/components/ui/Modal"
import RatingReview from "@/app/components/ui/RatingReview"
import { asset } from "@/app/lib/asset"
import { Rental } from "@/app/types/rental"
import { useRouter } from "next/navigation"
import nProgress from "nprogress"
import { SyntheticEvent, useState } from "react"
import styles from "./Review.module.scss"
import Flex from "@/app/components/layout/Flex"
import TextBox from "@/app/components/forms/TextBox"
import { Review as ReviewRequest } from "@/app/types/review"
import toast from "react-hot-toast"
import { createReview } from "@/app/data-access/reviews"
import { useSession } from "next-auth/react"

const Review = (rental: Rental) => {
  const router = useRouter()
  const session = useSession()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<String>("")

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    if (!rating || !comment) {
      return toast.error("Mohon masukkan field yang tersedia!")
    }

    const review: ReviewRequest = {
      rental_id: rental.id,
      rating: rating,
      comment: comment as string,
    }

    const res = await createReview({
      accessToken: session.data?.accessToken as string,
      schema: review,
    })

    toast.success("Terimakasih telah memberi ulasan!")
    setIsOpen(false)
    router.refresh()
  }

  return (
    <>
      <Action icon={asset("star.svg")} size={18} as="Edit" onAction={toggleOpen} />
      {isOpen && (
        <Modal title="Berikan Ulasan" isOpen={isOpen} onClose={toggleOpen}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Flex className={styles.formContent}>
              <RatingReview rating={rating} size={50} onRating={(value) => setRating(value)} />
              <TextBox
                type="text"
                placeholder="Masukkan ulasan anda ..."
                className={styles.comment}
                value={comment as string}
                onChange={(e) => setComment(e.target.value)}
              />
            </Flex>

            <FormAction onCancel={toggleOpen} />
          </form>
        </Modal>
      )}
    </>
  )
}

export default Review
