import { asset } from "@/app/lib/asset"
import Button from "../ui/Button"
import styles from "./Action.module.scss"
import Image from "next/image"

type ActionProps = { icon: string; size: number; as: string; onAction?: any }

const Action = ({ icon, size, as, onAction }: ActionProps) => {
  return (
    <Button className={`${styles.action}`} onClick={onAction} type="button">
      <Image src={icon} alt={as} width={size} height={size} />
    </Button>
  )
}

export default Action
