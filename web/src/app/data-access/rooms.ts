import { API } from "../constants/api"
import { Room } from "../types/room"

export const fetchRooms = async (obj: { accessToken: string }): Promise<Room[]> => {
  const res = await fetch(API + "/rooms", {
    headers: {
      Authorization: `Bearer ${obj.accessToken}`,
    },
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}

export const createRoom = async (obj: { accessToken: string; schema: Room }) => {
  const res = await fetch(API + "/rooms", {
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

export const updateRoom = async (obj: { accessToken: string; schema: Room; where: number | string }) => {
  const res = await fetch(API + `/rooms/${obj.where}`, {
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

export const deleteRoom = async (obj: { accessToken: string; where: number | string }) => {
  const res = await fetch(API + `/rooms/${obj.where}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${obj.accessToken}`,
    },
  })
  return res
}

export const getRoomsByDormitory = async (obj: { where: number | string }): Promise<Room[]> => {
  const res = await fetch(API + `/dormitories/${obj.where}/rooms`, {
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}

export const findRoom = async (obj: { accessToken: string; where: number | string }): Promise<Room> => {
  const res = await fetch(API + `/rooms/${obj.where}`, {
    headers: {
      Authorization: `Bearer ${obj.accessToken}`,
    },
    cache: "no-store",
  })
  const json = await res.json()
  return json.data
}
