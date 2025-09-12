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
    menu: "Sewa",
    linkTo: "/rent",
  },
  {
    menu: "Kontak",
    linkTo: "/contact",
  },
  {
    menu: "Telusuri",
    linkTo: "/search",
  },
]
