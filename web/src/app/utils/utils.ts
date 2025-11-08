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

  transactions?.forEach((transaction) => {
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

  rentals?.forEach((rental) => {
    if (rental.status !== "active" && rental.status !== "finished") return

    const date = new Date(String(rental.start_date))
    const monthName = date.toLocaleString("id-ID", { month: "short" })
    const key = `${monthName}`

    monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1)
  })

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

  return Array.from(monthlyMap.entries())
    ?.sort((a, b) => monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0]))
    ?.map(([name, renters]) => ({
      name,
      renters,
    }))
}

export const calculateRevenue = (transactions: Transaction[]) => {
  let revenue = 0

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  transactions?.forEach((transaction) => {
    const date = new Date(String(transaction.created_at))
    const month = date.getMonth()
    const year = date.getFullYear()

    if (transaction.status === "success" && month === currentMonth && year === currentYear) {
      revenue += Number(transaction.amount)
    }
  })

  return revenue
}

export const filter = <T>() => ({
  arrays: [] as T[],

  fromData(param: T[]) {
    this.arrays = param
    return this
  },

  byKeywords(keywords?: string) {
    if (!keywords) return this

    const deepIncludes = (obj: any, kw: string): boolean => {
      if (obj == null) return false

      if (typeof obj === "string") {
        return obj.toLowerCase().includes(kw.toLowerCase())
      }

      if (Array.isArray(obj)) {
        return obj.some((item) => deepIncludes(item, kw))
      }

      if (typeof obj === "object") {
        return Object.entries(obj).some(([key, value]) => {
          if (key === "created_at" || key === "updated_at") return false
          return deepIncludes(value, kw)
        })
      }

      return false
    }

    this.arrays = this.arrays?.filter((item) => deepIncludes(item, keywords))
    return this
  },

  get() {
    return this.arrays
  },
})
