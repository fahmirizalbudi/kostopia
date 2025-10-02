"use client"

import { createContext, useState, ReactNode, useContext } from "react"

type DataContextType = {
  duration: number
  setDuration: (value: number) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [duration, setDuration] = useState(1)

  return <DataContext.Provider value={{ duration, setDuration }}>{children}</DataContext.Provider>
}

export function useDataProvider() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useDuration harus digunakan di dalam <DataProvider>")
  }
  return context
}
