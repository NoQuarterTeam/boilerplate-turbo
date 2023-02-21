import * as React from "react"
import JSConfetti from "js-confetti"

export function Confetti() {
  React.useEffect(() => {
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti()
  }, [])
  return null
}
