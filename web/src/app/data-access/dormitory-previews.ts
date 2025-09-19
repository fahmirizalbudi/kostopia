import { API } from "../constants/api"
import { DormitoryPreview } from "../types/dormitory-preview"

export const fetchDormitoryPreviews = async (obj: { where: number | string }): Promise<DormitoryPreview[]> => {
  const res = await fetch(API + `/dormitories/${obj.where}/previews`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  })
  const json = await res.json()
  return json.data
}

export const createDormitoryPreview = async (obj: { accessToken: string; schema: FormData; where: number | string }) => {
  const res = await fetch(API + "/dormitory-previews", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${obj.accessToken}`,
    },
    body: obj.schema,
  })

  return res
}

export const deleteDormitoryPreviews = async (obj: { accessToken: string; where: number | string }) => {
  const res = await fetch(API + `/dormitory-previews/${obj.where}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${obj.accessToken}`,
    },
  })

  return res
}
