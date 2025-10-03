import { API } from "../constants/api"
import { Transaction } from "../types/transaction"

export const fetchTransactions = async (obj: { accessToken: string }): Promise<Transaction[]> => {
  const res = await fetch(API + "/transactions", {
    headers: {
      Authorization: `Bearer ${obj.accessToken}`,
    },
  })
  const json = await res.json()
  return json.data
}

export const getTransactionStatusByRental = async (obj: { where: number }): Promise<string> => {
  const res = await fetch(API + `/transactions/rental/${obj.where}/status`)
  const json = await res.json()
  return json.data.status
}

export const getTransactionMethodByRental = async (obj: { where: number }): Promise<string> => {
  const res = await fetch(API + `/transactions/rental/${obj.where}/status`)
  const json = await res.json()
  return json.data.method
}

export const createTransaction = async (obj: { accessToken: string; schema: Transaction }) => {
  const res = await fetch(API + `/transactions`, {
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

export const snapMidtrans = async (obj: { accessToken: string; schema: Transaction }): Promise<any> => {
  const res = await fetch(API + `/transactions/midtrans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${obj.accessToken}`,
    },
    body: JSON.stringify(obj.schema),
  })
  const json = await res.json()
  return json.data
}

export const changeTransactionStatus = async (obj: { where?: string; to?: string }) => {
  const res = await fetch(API + `/transactions/${obj.where}/status?to=${obj.to}`, {
    method: "PATCH",
  })
  return res
}

export const attachProof = async (obj: { accessToken: string; schema: FormData; where: number | string }) => {
  const res = await fetch(API + `/transactions/${obj.where}/proof`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${obj.accessToken}`,
    },
    body: obj.schema,
  })

  return res
}

export const getMyTransactions = async (obj: { accessToken: string }): Promise<Transaction[]> => {
  const res = await fetch(API + "/transactions/me", {
    headers: {
      Authorization: `Bearer ${obj.accessToken}`,
    },
  })
  const json = await res.json()
  return json.data
}
