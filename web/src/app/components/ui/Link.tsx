"use client"

import NextLink, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import NProgress from "nprogress"
import { MouseEvent } from "react"

type Props = LinkProps & {
  children: React.ReactNode
  className?: string
}

export default function Link({ children, onClick, href, ...props }: Props) {
  const router = useRouter()

  const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    NProgress.start()
    if (href) {
      router.push(href as string)
    }
    setTimeout(() => {
      NProgress.done()
    }, 1000)
    onClick?.(e)
  }

  return (
    <NextLink {...props} href={href} onClick={handleClick}>
      {children}
    </NextLink>
  )
}
