import * as React from "react"
import { hydrateRoot } from "react-dom/client"
import { RemixBrowser } from "@remix-run/react"

function hydrate() {
  React.startTransition(() => {
    hydrateRoot(document, <RemixBrowser />)
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  window.setTimeout(hydrate, 1)
}
