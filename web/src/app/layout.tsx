import type { Metadata } from "next"
import "./styles/globals.scss"
import ToasterProvider from "./components/ui/ToasterProvider"

export const metadata: Metadata = {
  title: "Kostopia - Rent a Dorm",
  description: "App that used for rent an dorm",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ToasterProvider>{children}</ToasterProvider>
      </body>
    </html>
  )
}
