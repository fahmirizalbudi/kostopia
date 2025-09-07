import { Option } from "../components/forms/ComboBox"

export function findOption(options: Option[], value: string | undefined | null): Option | null {
  return options.find((option) => option.value === value) || null
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