import * as React from "react"
import * as RAvatar from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { merge } from "~/lib/tailwind"

export const avatarStyles = cva("center rounded-full capitalize", {
  variants: {
    size: {
      xs: "sq-5 text-xs",
      sm: "sq-8 text-sm",
      md: "sq-10 text-md",
      lg: "sq-12 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export type AvatarProps = VariantProps<typeof avatarStyles>

interface Props extends AvatarProps, RAvatar.AvatarProps {
  name: string
  src?: string | null | undefined
}

export function Avatar({ size, src, name, ...props }: Props) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
  return (
    <RAvatar.Root className={merge(avatarStyles({ size }), props.className)}>
      <RAvatar.Image className="h-full w-full rounded-[inherit] object-cover" src={src || undefined} alt="avatar" />
      <RAvatar.Fallback
        className="center h-full w-full rounded-[inherit] bg-primary-700 object-cover text-xs font-semibold text-white"
        delayMs={600}
      >
        {initials}
      </RAvatar.Fallback>
    </RAvatar.Root>
  )
}
