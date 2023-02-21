import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { merge } from "~/lib/tailwind"

const spinnerStyles = cva("animate-spin text-black dark:text-white", {
  variants: {
    size: {
      xs: "sq-3",
      sm: "sq-4",
      md: "sq-5",
      lg: "sq-7",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export type SpinnerStyleProps = VariantProps<typeof spinnerStyles>
export type SpinnerProps = React.SVGProps<SVGSVGElement> & SpinnerStyleProps

export function Spinner({ size, ...props }: SpinnerProps) {
  return (
    <svg
      {...props}
      className={merge(spinnerStyles({ size }), props.className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
