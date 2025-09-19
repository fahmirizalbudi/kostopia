import Flex from "@/app/components/layout/Flex"
import Image from "next/image"
import styles from "../page.module.scss"
import { asset } from "@/app/lib/asset"

type FacilityProps = {
  text: string
}

const Facility = ({ text }: FacilityProps) => {
  return (
    <Flex className={styles.facility}>
      <Image width={20} height={20} alt="Check" src={asset("cb.svg")} />
      <span className={styles.facilityText}>{text}</span>
    </Flex>
  )
}

export default Facility
