import * as React from "react"

import { useDisclosure } from "~/lib/hooks/useDisclosure"

export function useStoredDisclosure(key: string, args?: { defaultIsOpen?: boolean }) {
  const disclosureProps = useDisclosure({
    defaultIsOpen: localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || "false") : args?.defaultIsOpen,
  })

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(disclosureProps.isOpen))
  }, [key, disclosureProps.isOpen])
  return disclosureProps
}
