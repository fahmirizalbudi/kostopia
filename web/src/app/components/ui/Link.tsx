"use client"

import NextLink, { LinkProps } from "next/link"
import NProgress from "nprogress"
import { MouseEvent } from "react"

type Props = LinkProps & {
  children: React.ReactNode
  className?: string
}

export default function Link({ children, onClick, ...props }: Props) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    NProgress.start()
    onClick?.(e)
  }

  return (
    <NextLink {...props} onClick={handleClick}>
      {children}
    </NextLink>
  )
}
