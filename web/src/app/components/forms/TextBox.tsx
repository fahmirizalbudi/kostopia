import Image from "next/image"
import styles from "./TextBox.module.scss"

type TextBoxProps = {
  type: "text" | "email" | "number" | "hidden"
  placeholder: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  value?: number | string
  className?: string
  icon?: string
  iconSize?: number
}

const TextBox = ({ type, placeholder, onChange, name, value, className, icon, iconSize }: TextBoxProps) => (
  <div className={`${styles.textbox} ${className}`}>
    {icon && <Image src={icon} width={iconSize} height={iconSize} alt="Icon" />}
    <input type={type} placeholder={placeholder} onChange={onChange} name={name} value={value} id={name} autoComplete="off" />
  </div>
)

export default TextBox
