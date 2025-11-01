"use client"

import Action from "@/app/components/forms/Action"
import { API } from "@/app/constants/api"
import { asset } from "@/app/lib/asset"
import { Rental } from "@/app/types/rental"
import { useRouter } from "next/navigation"
import nProgress from "nprogress"

const RenewalButton = (rental: Rental) => {
  const router = useRouter()

  const handleAction = () => {
    nProgress.start()
    router.push(`/rentals/${rental.id}/renewal`)
  }

  return <Action icon={asset("extend.svg")} size={18} as="Perpanjang Sewa" onAction={handleAction} />
}

export default RenewalButton
