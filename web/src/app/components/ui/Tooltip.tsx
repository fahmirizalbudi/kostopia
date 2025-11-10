"use client"

import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import { ReactElement } from "react"

type TooltipProps = {
  children: ReactElement
  text: string
  placement?: "top" | "bottom" | "left" | "right"
}

const Tooltip = ({ children, text, placement = "top" }: TooltipProps) => {
  return <Tippy content={text} placement={placement}>{children}</Tippy>
}

export default Tooltip
