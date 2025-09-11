"use client"

import Action from "@/app/components/forms/Action"
import { asset } from "@/app/lib/asset"
import { Dormitory } from "@/app/types/dormitory"
import { useRouter } from "next/navigation"

const PreviewsDormitory = (dormitory: Dormitory) => {
  const router = useRouter()
  const onPreviewsAction = () => router.push(`/admin/dormitories/${dormitory.id}/previews`)
  return <Action icon={asset("preview.svg")} size={18} as="Preview" onAction={onPreviewsAction} />
}

export default PreviewsDormitory
