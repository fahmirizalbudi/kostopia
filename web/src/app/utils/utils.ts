import { Option } from "../components/forms/ComboBox"

export function findOption(options: Option[], value: string | undefined | null): Option | null {
  return options.find((option) => option.value === value) || null
}

export function asc(arr: any[], by: string): any[] {
  return arr.sort((a, b) => a[by] - b[by])
}