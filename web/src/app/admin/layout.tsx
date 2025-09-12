import type { Metadata } from "next"
import SideNavigation from "./components/SideNavigation"
import { menuSideNavigation } from "../menu/side-navigation"
import AppBar from "./components/AppBar"

export const metadata: Metadata = {
  title: "Kostopia - Admin Dashboard",
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
        <SideNavigation menu={menuSideNavigation} />
        <AppBar />
        {children}
      </body>
    </html>
  )
}
