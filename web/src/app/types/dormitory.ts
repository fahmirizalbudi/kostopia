import { DormitoryPreview } from "./dormitory-preview"

export type Dormitory = {
  id?: number,
  name?: string,
  address?: string,
  description?: string,
  price?: number | null | string,
  facilities?: string,
  google_maps?: string,
  previews?: DormitoryPreview[]
  created_at?: string,
  updated_at?: string,
}