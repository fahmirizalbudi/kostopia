import { API } from "../constants/api"
import { Rental } from "../types/rental"

export const fetchRentals = async (obj: { accessToken: string }): Promise<Rental[]> => {
  const res = await fetch(API + "/rentals", {
    headers: {
      Authorization: `Bearer ${obj.accessToken}`,
    },
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}

export const getMyRentals = async (obj: { accessToken: string }): Promise<Rental[]> => {
  const res = await fetch(API + "/rentals/me", {
    headers: {
      Authorization: `Bearer ${obj.accessToken}`,
    },
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}

export const findRental = async (obj: { where: string | number }): Promise<Rental> => {
  const res = await fetch(API + `/rentals/${obj.where}`, {
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}

export const createRental = async (obj: { accessToken: string; schema: Rental }) => {
  const res = await fetch(API + "/rentals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${obj.accessToken}`,
    },
    body: JSON.stringify(obj.schema),
  })
  return res
}
