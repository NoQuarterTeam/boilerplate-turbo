import * as React from "react"
import { type SerializeFrom } from "@remix-run/node"

import { type loader } from "~/root"

import { useToast } from "./ui/Toast"

interface Props {
  flash: SerializeFrom<typeof loader>["flash"]
}

export function FlashMessage(props: Props) {
  const toast = useToast()
  React.useEffect(() => {
    if (props.flash.flashError) {
      toast({ title: props.flash.flashError.title, description: props.flash.flashError.description, status: "error" })
    }
    if (props.flash.flashInfo) {
      toast({ title: props.flash.flashInfo.title, description: props.flash.flashInfo.description, status: "info" })
    }
  }, [props.flash])
  return null
}
