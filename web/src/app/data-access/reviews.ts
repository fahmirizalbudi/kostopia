import { API } from "../constants/api"
import { Review } from "../types/review"

export const getReviewsByDormitory = async (obj: { where: number | string }): Promise<Review[]> => {
  const res = await fetch(API + `/reviews/${obj.where}/dormitory`, {
    cache: "no-store",
  })
  const json = await res.json()
  return json?.data
}

export const createReview = async (obj: { accessToken: string; schema: Review }) => {
  const res = await fetch(API + "/reviews", {
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
