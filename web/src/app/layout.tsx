import type { Metadata } from "next"
import "./styles/globals.scss"
import ToasterProvider from "./components/ui/ToasterProvider"
import { SessionProvider } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import SessionProviderWrapper from "./components/layout/ServerSessionWrapper"

export const metadata: Metadata = {
  title: "Kostopia - Rent a Dorm",
  description: "App that used for rent an dorm",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper session={session}>
          <ToasterProvider>{children}</ToasterProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
