import * as React from "react"
import { Transition } from "@headlessui/react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { join } from "~/lib/tailwind"

import { Button } from "./Button"

interface Props {
  triggerButton: React.ReactNode
  confirmButton: React.ReactNode
  title?: string
  description?: string
}

export function AlertDialog(props: Props) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <AlertDialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogPrimitive.Trigger asChild>{props.triggerButton}</AlertDialogPrimitive.Trigger>
      <AlertDialogPrimitive.Portal forceMount>
        <Transition.Root show={isOpen}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <AlertDialogPrimitive.Overlay forceMount className="fixed inset-0 z-50 bg-black/50" />
          </Transition.Child>
          <Transition.Child
            // as="div"
            className="center fixed inset-0 z-50 h-screen w-screen p-4"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <AlertDialogPrimitive.Content
              forceMount
              className={join(
                "max-w-md rounded-xs bg-white p-4 shadow-lg focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 dark:bg-gray-900 md:w-full",
              )}
            >
              <AlertDialogPrimitive.Title className="font-medium text-gray-900 dark:text-gray-100">
                {props.title || "Are you absolutely sure?"}
              </AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description className="mt-2 text-sm font-normal opacity-70">
                {props.description || "This action cannot be undone."}
              </AlertDialogPrimitive.Description>
              <div className="mt-4 flex justify-end space-x-2">
                <AlertDialogPrimitive.Cancel asChild>
                  <Button variant="ghost">Cancel</Button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogPrimitive.Action asChild>{props.confirmButton}</AlertDialogPrimitive.Action>
              </div>
            </AlertDialogPrimitive.Content>
          </Transition.Child>
        </Transition.Root>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
