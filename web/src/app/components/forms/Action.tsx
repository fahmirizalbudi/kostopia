"use client"

import Button from "../ui/Button"
import Tooltip from "../ui/Tooltip"
import styles from "./Action.module.scss"
import Image from "next/image"

type ActionProps = {
  icon: string
  size: number
  as: string
  onAction?: () => void
  className?: string
}

const Action = ({ icon, size, as, onAction, className }: ActionProps) => {
  return (
    <Tooltip text={as}>
      <Button className={`${styles.action} ${className || ""}`} onClick={onAction} type="button">
        <Image src={icon} alt={as} width={size} height={size} />
      </Button>
    </Tooltip>
  )
}

export default Action
