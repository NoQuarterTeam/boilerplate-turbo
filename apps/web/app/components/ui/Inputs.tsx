import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { merge } from "~/lib/tailwind"

export const inputStyles = cva(
  "text-base block w-full border text-black dark:text-white placeholder-gray-500 transition-colors focus:border-primary-500 focus:bg-transparent focus:ring-transparent rounded-xs focus:ring-primary-500 ring-0 focus:ring-2",
  {
    variants: {
      variant: {
        solid: "border-transparent bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10",
        outline: "bg-transparent border-black/10 hover:border-black/40 dark:border-white/10 dark:hover:border-white/20",
        ghost: "border-transparent bg-transparent hover:border-black/10 dark:hover:border-white/10",
      },
      size: {
        xs: "text-xs px-2 py-1",
        sm: "text-sm px-3 py-1.5",
        md: "text-md px-4 py-2",
        lg: "text-lg px-5 py-3",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "sm",
    },
  },
)

export const inputSizeStyles = cva("", {
  variants: {
    size: {
      xs: "h-7",
      sm: "h-9",
      md: "h-11",
      lg: "h-12",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

export type InputStyleProps = VariantProps<typeof inputStyles>
export type InputSizeStyleProps = VariantProps<typeof inputSizeStyles>

export interface InputProps
  extends React.AriaAttributes,
    Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "size">,
    InputStyleProps,
    InputSizeStyleProps {
  name?: string
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function _Input({ size, variant, ...props }, ref) {
  return (
    <input
      type="text"
      ref={ref}
      id={props.name}
      {...props}
      className={merge(inputStyles({ variant, size }), inputSizeStyles({ size }), props.className)}
    />
  )
})

export interface TextareaProps
  extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
    InputStyleProps {
  name?: string
}
const paddingMap = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
} as const

const lineHeightMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
}
export function Textarea({ variant, size, ...props }: TextareaProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null)
  // Dealing with Textarea Height
  const calcHeight = (value: string) => {
    if (!ref.current) return
    const numberOfLineBreaks = (value.match(/\n/g) || []).length
    const lineHeight = lineHeightMap[size || "sm"]
    // min-height + lines x line-height + padding + border
    const newHeight = lineHeight + numberOfLineBreaks * lineHeight + paddingMap[size || "sm"] * 2 + 2
    ref.current.style.height = `${newHeight}px`
  }

  React.useEffect(() => {
    if (!ref.current) return
    calcHeight(ref.current.value)
  }, [])

  return (
    <textarea
      ref={ref}
      id={props.name}
      {...props}
      onChange={(e) => calcHeight(e.currentTarget.value)}
      className={merge(inputStyles({ variant, size }), "resize-none", props.className)}
    />
  )
}

export interface SelectProps
  extends Omit<React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, "size">,
    InputStyleProps,
    InputSizeStyleProps {
  name?: string
}
export function Select({ variant, size, ...props }: SelectProps) {
  return (
    <select
      id={props.name}
      {...props}
      className={merge(inputStyles({ variant, size }), inputSizeStyles({ size }), props.className)}
    >
      {props.children}
    </select>
  )
}

export const checkboxSizeStyles = cva("", {
  variants: {
    size: {
      sm: "sq-5",
      md: "sq-7",
      lg: "sq-9",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})
export type CheckboxSizeStyleProps = VariantProps<typeof checkboxSizeStyles>

export function Checkbox({
  size = "sm",
  ...props
}: Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "size"> &
  CheckboxSizeStyleProps) {
  return (
    <input
      type="checkbox"
      {...props}
      className={merge(
        inputStyles({ variant: "outline", size: "xs" }),
        checkboxSizeStyles({ size }),
        "cursor-pointer text-primary-500 transition-all checked:bg-primary-500 hover:text-primary-600 focus:ring-primary-300  dark:checked:bg-primary-500  dark:hover:checked:bg-primary-600 dark:focus:ring-primary-300 ",
        props.className,
      )}
    />
  )
}
