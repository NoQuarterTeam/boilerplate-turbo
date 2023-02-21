import { Link, type LinkProps } from "@remix-run/react"

import { join, merge } from "~/lib/tailwind"

import { buttonSizeStyles, type ButtonStyleProps, buttonStyles } from "./Button"
import { Spinner } from "./Spinner"

interface LinkButtonProps extends ButtonStyleProps, LinkProps {
  isLoading?: boolean
  leftIcon?: React.ReactNode
}

export function LinkButton({ variant, size, isLoading, leftIcon, disabled, colorScheme, ...props }: LinkButtonProps) {
  return (
    <div className={join("inline-block", disabled && "cursor-not-allowed")}>
      <Link
        style={{ pointerEvents: disabled ? "none" : undefined }}
        {...props}
        className={merge(buttonStyles({ size, colorScheme, variant, disabled }), buttonSizeStyles({ size }), props.className)}
      >
        <div className={join("center", isLoading && "opacity-0")} aria-hidden={isLoading}>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {props.children}
        </div>
        {isLoading && (
          <div className="center absolute inset-0">
            <Spinner size={size} />
          </div>
        )}
      </Link>
    </div>
  )
}
