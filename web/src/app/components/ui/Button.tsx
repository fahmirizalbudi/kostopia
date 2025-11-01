import React from "react"

type ButtonProps = {
  className?: string
  onClick?: () => void
  children: React.ReactNode
  type?: "button" | "submit"
  disabled?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, onClick, children, type = "button", disabled = false }, ref) => {
  return (
    <button ref={ref} className={className} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  )
})

Button.displayName = "Button"
export default Button
