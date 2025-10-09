import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export const Button = ({ label, ...props }: ButtonProps) => {
  return (
    <button {...props} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
      {label}
    </button>
  )
}
