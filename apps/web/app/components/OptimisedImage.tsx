import type * as React from "react"

type Fit = "cover" | "contain" | "fill" | "inside" | "outside"

interface Props extends React.ComponentPropsWithoutRef<"img"> {
  height: number
  width: number
  alt: string
  quality?: number
  fit?: Fit
}

export const transformImageSrc = (
  src: string | undefined | null,
  options: { width: number; height: number; quality?: number; fit?: Fit },
) =>
  src
    ? "/api/image/?src=" +
      encodeURIComponent(src) +
      `&width=${options.width || ""}&height=${options.height || ""}&quality=${options.quality || ""}&fit=${
        options.fit || "cover"
      }`
    : undefined

export function OptimizedImage({ src, quality, fit, ...props }: Props) {
  const newSrc = transformImageSrc(src, { width: props.width, height: props.height, quality, fit })
  return <img {...props} alt={props.alt} src={newSrc} />
}
