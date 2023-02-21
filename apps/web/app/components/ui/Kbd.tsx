import type * as React from "react"

export function Kbd(props: { children: React.ReactNode }) {
  return (
    <span className="whitesspanace-nowrap inline-block rounded-md border border-b-4 border-black/20 bg-transparent px-1 font-mono text-xs font-medium dark:border-white/20">
      {props.children}
    </span>
  )
}
