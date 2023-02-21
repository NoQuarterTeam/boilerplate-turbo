import * as React from "react"
import { Dialog, Transition } from "@headlessui/react"

import { join } from "~/lib/tailwind"

// import { twMerge } from 'tailwind-join'
import { CloseButton } from "./CloseButton"

export function useDrawer({ defaultIsOpen = false }: { defaultIsOpen?: boolean } | undefined = {}) {
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  const onToggle = () => setIsOpen((o) => !o)

  return { isOpen, onOpen, onClose, onToggle }
}

export interface DrawerProps {
  isOpen: boolean
  onOpen?: () => void
  onClose: () => void
  title?: string
  children?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

export function Drawer({ isOpen, size = "md", onClose, ...props }: DrawerProps) {
  return (
    <Transition.Root appear show={isOpen} as={React.Fragment}>
      <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 right-0 z-30 flex h-screen justify-end overflow-y-auto">
        <Transition.Child
          as={React.Fragment}
          enter="ease-in-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        {/* <div className="fixed inset-0 overflow-y-auto">
          <div className={cn("flex min-h-full flex-col items-center p-0 pt-14 sm:p-4")}> */}

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-200"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className={join(
                    "pointer-events-auto relative w-screen overflow-hidden bg-white shadow-xl transition-all dark:bg-gray-700",
                    size === "sm" && "max-w-sm",
                    size === "md" && "max-w-md",
                    size === "lg" && "max-w-lg",
                    size === "xl" && "max-w-xl",
                    size === "full" && "max-w-full",
                  )}
                >
                  {props.title && (
                    <Dialog.Title as="p" className="p-4 text-lg font-medium">
                      {props.title}
                    </Dialog.Title>
                  )}
                  <div className="absolute right-2 top-2">
                    <CloseButton size="sm" onClick={onClose} />
                  </div>
                  <div>{props.children}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
