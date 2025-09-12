import { Dormitory } from "./dormitory"

export type Room = {
  id?: number
  dormitory_id?: number | string | null
  room_number?: string
  status?: string
  dormitory?: Dormitory
  created_at?: string
  updated_at?: string
}