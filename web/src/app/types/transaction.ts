import { Rental } from "./rental"

export type Transaction = {
  id?: string
  rental_id?: number
  dormitory_price?: number
  month_paid?: number
  amount?: number
  method?: string
  purpose?: string
  status?: string
  proof?: string
  rental?: Rental
  created_at?: string
}
