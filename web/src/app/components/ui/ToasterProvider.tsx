"use client"

import { Toaster } from "react-hot-toast"

export default function ToasterProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontFamily: "SF Pro Display",
          },
        }}
      />
      {children}
    </>
  )
}
