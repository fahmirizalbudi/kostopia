"use client"

import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import { ReactElement } from "react"

type TooltipProps = {
  children: ReactElement
  text: string
}

const Tooltip = ({ children, text }: TooltipProps) => {
  return <Tippy content={text}>{children}</Tippy>
}

export default Tooltip
