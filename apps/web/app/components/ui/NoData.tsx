import type * as React from "react"
import { FiAlertTriangle } from "react-icons/fi"

interface Props {
  children: React.ReactNode
}
export function NoData(props: Props) {
  return (
    <div className="hstack border border-gray-700 py-3 px-4">
      <FiAlertTriangle className="text-gray-500" />
      <p className="text-gray-500">{props.children}</p>
    </div>
  )
}
