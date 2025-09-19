import { API } from "../constants/api"
import { Dormitory } from "../types/dormitory"

export const fetchDormitories = async (): Promise<Dormitory[]> => {
  const res = await fetch(API + "/dormitories", {
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}

export const createDormitory = async (obj: { accessToken: string; schema: Dormitory }) => {
  const res = await fetch(API + "/dormitories", {
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

export const findDormitory = async (obj: { where: number | string }): Promise<Dormitory> => {
  const res = await fetch(API + `/dormitories/${obj.where}`, {
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}

export const updateDormitory = async (obj: { accessToken: string; schema: Dormitory; where: number | string }) => {
  const res = await fetch(API + `/dormitories/${obj.where}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${obj.accessToken}`,
    },
    body: JSON.stringify(obj.schema),
  })

  return res
}

export const deleteDormitory = async (obj: { accessToken: string; where: number | string }) => {
  const res = await fetch(API + `/dormitories/${obj.where}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${obj.accessToken}`,
    },
  })

  return res
}

export const fetchDormitoriesWithPreviews = async () => {
  const res = await fetch(API + "/dormitories/previews", {
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}
