type ButtonProps = {
    className?: string,
    onClick?: () => void,
    children: React.ReactNode,
    type?: "button" | "submit"
    disabled?: boolean
}

const Button = (buttonProps: ButtonProps) => {
  return (
    <button className={buttonProps.className} onClick={buttonProps.onClick} type={buttonProps.type} disabled={buttonProps.disabled}>{buttonProps.children}</button>
  )
}

export default Button