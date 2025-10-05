export type menuNavigationBarProps = {
  menu: string
  linkTo: string
}

export const menuNavigationBar: menuNavigationBarProps[] = [
  {
    menu: "Beranda",
    linkTo: "/",
  },
  {
    menu: "Cari Kos",
    linkTo: "/dormitories",
  },
  {
    menu: "Informasi",
    linkTo: "/information",
  },
  {
    menu: "Kontak Kami",
    linkTo: "https://wa.me/081214696011",
  },
]
