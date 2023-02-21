import * as React from "react"

export const useEventListener = (
  eventName: string,
  handler: (event: any) => void,
  element = global,
  options: AddEventListenerOptions = {},
) => {
  const savedHandler = React.useRef<any>()
  const { capture, passive, once } = options

  React.useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  React.useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) {
      return
    }

    const eventListener = (event: Event) => savedHandler.current(event)
    const opts = { capture, passive, once }
    element.addEventListener(eventName, eventListener, opts)
    return () => {
      element.removeEventListener(eventName, eventListener, opts)
    }
  }, [eventName, element, capture, passive, once])
}
