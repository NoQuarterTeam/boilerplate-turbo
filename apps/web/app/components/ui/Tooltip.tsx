import type * as React from "react"
import * as RTooltip from "@radix-ui/react-tooltip"

interface Props {
  children: React.ReactNode
  label: string
  side?: RTooltip.TooltipContentProps["side"]
}

export function Tooltip(props: Props) {
  return (
    <RTooltip.Root delayDuration={200}>
      <RTooltip.Trigger asChild>{props.children}</RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          className="z-[1000] rounded-sm bg-gray-900 px-1 text-sm text-white shadow-md dark:bg-gray-600"
          side={props.side}
          sideOffset={5}
        >
          {props.label}
          <RTooltip.Arrow className="fill-gray-900 dark:fill-gray-600" />
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  )
}
