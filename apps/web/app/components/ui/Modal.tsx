import * as React from "react"
import { Dialog, Transition } from "@headlessui/react"

import { join } from "~/lib/tailwind"

import { CloseButton } from "./CloseButton"

export interface ModalProps {
  isOpen: boolean
  onOpen?: () => void
  onClose: () => void
  title?: string
  position?: "top" | "center"
  children?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"
}

export function Modal({ isOpen, size = "xl", onClose, position = "top", ...props }: ModalProps) {
  return (
    <Transition.Root appear show={isOpen} as={React.Fragment}>
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div
            className={join(
              "flex min-h-full flex-col items-center",
              position === "top" ? "justify-start" : "justify-center",
              size !== "full" && "p-0 pt-10 sm:p-4 md:pt-16",
            )}
          >
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={join(
                  "relative w-full overflow-hidden rounded-sm bg-white shadow-xl transition-all dark:bg-gray-700",
                  size === "sm" && "max-w-sm",
                  size === "md" && "max-w-md",
                  size === "lg" && "max-w-lg",
                  size === "xl" && "max-w-xl",
                  size === "2xl" && "max-w-2xl",
                  size === "3xl" && "max-w-3xl",
                  size === "full" && "max-w-full",
                )}
              >
                {props.title && (
                  <Dialog.Title as="p" className="p-4 pb-0 text-lg font-medium">
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
      </Dialog>
    </Transition.Root>
  )
}
