import * as React from "react"

let hydrating = true

export function useHydrated() {
  let [hydrated, setHydrated] = React.useState(() => !hydrating)

  React.useEffect(function hydrate() {
    hydrating = false
    setHydrated(true)
  }, [])

  return hydrated
}

type Props = {
  children(): React.ReactNode
  fallback?: React.ReactNode
}
export function ClientOnly({ children, fallback = null }: Props) {
  return useHydrated() ? <>{children()}</> : <>{fallback}</>
}
