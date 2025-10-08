import { Option } from "../components/forms/ComboBox"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Transaction } from "../types/transaction"
import { Rental } from "../types/rental"

export function findOption(options: Option[], value: string | undefined | null): Option | null {
  return options?.find((option) => option.value === value) || null
}

export function asc(arr: any[], by: string): any[] {
  return arr?.sort((a, b) => a[by] - b[by])
}

export const rupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const transformDataForTransactionMonthChart = (transactions: Transaction[]) => {
  const monthlyData: Record<string, { revenue: number }> = {}
  MONTH_NAMES.forEach((month) => {
    monthlyData[month] = { revenue: 0 }
  })

  transactions.forEach((transaction) => {
    const date = new Date(String(transaction.created_at))
    const month = MONTH_NAMES[date.getMonth()]

    if (transaction.status === "success") {
      monthlyData[month].revenue += Number(transaction.amount)
    }
  })

  return MONTH_NAMES.map((month) => ({
    name: month,
    revenue: monthlyData[month].revenue,
  }))
}

export function transformRentalsToMonthlyData(rentals: Rental[]): { name: string; renters: number }[] {
  const monthlyMap: Map<string, number> = new Map()

  rentals.forEach((rental) => {
    if (rental.status !== "active" && rental.status !== "finished") return

    const date = new Date(String(rental.start_date))
    const monthName = date.toLocaleString("id-ID", { month: "short" })
    const key = `${monthName}`

    monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1)
  })

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

  return Array.from(monthlyMap.entries())
    .sort((a, b) => monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0]))
    .map(([name, renters]) => ({
      name,
      renters,
    }))
}
