import * as React from "react"

export function useDisclosure({ defaultIsOpen = false }: { defaultIsOpen?: boolean } | undefined = {}) {
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  const onToggle = () => setIsOpen((o) => !o)

  return { isOpen, onOpen, onClose, onToggle, onSetIsOpen: setIsOpen }
}

export type DisclosureProps = ReturnType<typeof useDisclosure>
