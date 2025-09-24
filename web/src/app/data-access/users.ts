import { API } from "../constants/api"
import { User } from "../types/user"

export const fetchUsers = async (obj: { accessToken: string }): Promise<User[]> => {
  const res = await fetch(API + "/users", {
    headers: {
      Authorization: `Bearer ${obj.accessToken}`,
    },
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}

export const createUser = async (obj: { accessToken: string; schema: User }) => {
  const res = await fetch(API + "/users", {
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

export const updateUser = async (obj: { accessToken: string; schema: User; where: number | string }) => {
  const res = await fetch(API + `/users/${obj.where}`, {
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

export const deleteUser = async (obj: { accessToken: string; where: number | string }) => {
  const res = await fetch(API + `/users/${obj.where}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${obj.accessToken}`,
    },
  })

  return res
}

export const findUser = async (obj: { where: number | string }): Promise<User> => {
  const res = await fetch(API + `/users/${obj.where}`, {
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}