import { API } from "../constants/api"

export const getTransactionStatusByRental = async (obj: {where: number}): Promise<string> => {
  const res = await fetch(API + `/transactions/rental/${obj.where}/status`)
  const json = await res.json()
  return json.data.status
}