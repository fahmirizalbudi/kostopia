import { Room } from "./room"
import { User } from "./user"

export type Rental = {
  id?: number
  room_id?: number
  tenant_id?: number
  start_date?: string
  end_date?: string
  duration_months?: number
  status?: string
  room?: Room
  tenant?: User
  created_at?: string
}