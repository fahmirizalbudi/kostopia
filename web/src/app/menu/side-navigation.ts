export type menuSideNavigationProps = {
  text: string
  linkTo?: string
  icon?: string
  type: "header" | "link"
}

export const MENU_SIDE_HEADER = "header"
export const MENU_SIDE_LINK = "link"

export const menuSideNavigation: menuSideNavigationProps[] = [
  {
    text: "MAIN MENU",
    type: MENU_SIDE_HEADER
  },
  {
    text: "Beranda",
    linkTo: "/admin",
    icon: "beranda.svg",
    type: MENU_SIDE_LINK
  },
  {
    text: "MASTER DATA",
    type: MENU_SIDE_HEADER
  },
  {
    text: "Pengguna",
    linkTo: "/admin/users",
    icon: "pengguna.svg",
    type: MENU_SIDE_LINK
  },
  {
    text: "Kos",
    linkTo: "/admin/dormitories",
    icon: "kost.svg",
    type: MENU_SIDE_LINK
  },
  {
    text: "Kamar Kos",
    linkTo: "/admin/rooms",
    icon: "kamar.svg",
    type: MENU_SIDE_LINK
  },
  {
    text: "TRADE",
    type: MENU_SIDE_HEADER
  },
  {
    text: "Penyewaan",
    linkTo: "/admin/rentals",
    icon: "penyewaan.svg",
    type: MENU_SIDE_LINK
  },
  {
    text: "Transaksi",
    linkTo: "/admin/transactions",
    icon: "transaksi.svg",
    type: MENU_SIDE_LINK
  },
  {
    text: "SUMMARY",
    type: MENU_SIDE_HEADER
  },
  {
    text: "Ulasan",
    linkTo: "/admin/reviews",
    icon: "reviews.svg",
    type: MENU_SIDE_LINK
  },
  {
    text: "Laporan",
    linkTo: "/admin/report",
    icon: "laporan.svg",
    type: MENU_SIDE_LINK
  },
]