"use client"

import NextLink, { LinkProps } from "next/link"
import NProgress from "nprogress"
import { MouseEvent } from "react"
import { usePathname } from "next/navigation"

type Props = LinkProps & {
  children: React.ReactNode
  className?: string
}

export default function Link({ children, href, onClick, ...props }: Props) {
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href !== pathname) {
      NProgress.start()
    }
    onClick?.(e)
  }

  return (
    <NextLink {...props} href={href} onClick={handleClick}>
      {children}
    </NextLink>
  )
}
