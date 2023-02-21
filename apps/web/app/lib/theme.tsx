import { type SerializeFrom } from "@remix-run/node"
import { useRouteLoaderData } from "@remix-run/react"

import { type loader } from "~/root"

export type Theme = "light" | "dark"

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark"
}

export function useTheme() {
  const { theme } = useRouteLoaderData("root") as SerializeFrom<typeof loader>
  return theme
}
