import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast"

import { join } from "~/lib/tailwind"

import { CloseButton } from "./CloseButton"

interface Toast {
  id: number
  title?: string
  description?: string
  status: "error" | "warning" | "info"
}

export function Toaster(props: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const handleSetToast = (toast: NewToast) => {
    setToasts((toasts) => [...toasts, { id: new Date().getMilliseconds(), ...toast, status: toast.status || "info" }])
  }

  return (
    <ToastProvider swipeDirection="right">
      <ToastContext.Provider value={handleSetToast}>
        {props.children}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            onOpenChange={(open) => (open ? undefined : setToasts((toasts) => toasts.filter((t) => t.id !== toast.id)))}
            className={join(
              "radix-state-open:animate-toast-slide-in-right",
              "radix-state-closed:animate-toast-hide",
              "radix-swipe-direction-right:radix-swipe-end:animate-toast-swipe-out-x",
              "radix-swipe-direction-right:translate-x-radix-toast-swipe-move-x",
              "radix-swipe-direction-down:radix-swipe-end:animate-toast-swipe-out-y",
              "radix-swipe-direction-down:translate-y-radix-toast-swipe-move-y",
              "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
              "z-50 w-auto rounded-md border border-gray-75 shadow-xl focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 dark:border-gray-800 md:w-full md:max-w-sm",
              toast.status === "info" && "bg-white dark:bg-gray-700",
              toast.status === "error" && "bg-red-500 dark:bg-red-700",
              toast.status === "warning" && "bg-orange-500 dark:bg-orange-700",
            )}
          >
            <div className="flex">
              <div className="flex w-0 flex-1 items-center py-4 pl-5">
                <div className="radix w-full">
                  <ToastPrimitive.Title className="text-sm font-medium text-gray-900 dark:text-white">
                    {toast.title}
                  </ToastPrimitive.Title>
                  {toast.description && (
                    <ToastPrimitive.Description className="mt-1 text-sm text-gray-900 opacity-70 dark:text-white">
                      {toast.description}
                    </ToastPrimitive.Description>
                  )}
                </div>
              </div>
              <div className="px-3 py-2">
                <ToastPrimitive.Action altText="dismiss" asChild>
                  <CloseButton />
                </ToastPrimitive.Action>
              </div>
            </div>
          </ToastPrimitive.Root>
        ))}
        <ToastViewport className="fixed bottom-0 right-0 z-[500] flex w-96 max-w-full flex-col space-y-4 p-4 outline-none" />
      </ToastContext.Provider>
    </ToastProvider>
  )
}

type NewToast = Partial<Pick<Toast, "title" | "description" | "status">>

const ToastContext = React.createContext<((toast: NewToast) => void) | null>(null)

export function useToast() {
  const toast = React.useContext(ToastContext)
  if (!toast) throw new Error("No toast context")
  return toast
}
