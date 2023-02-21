import * as React from "react"
import { Pressable, PressableProps, Text } from "react-native"

interface Props extends PressableProps {
  className?: string
  textClassName?: string
  children: React.ReactNode
}

export function Button(props: Props) {
  return (
    <Pressable onPress={props.onPress} className="bg-primary-500 rounded-md p-4">
      <Text className="text-center text-lg font-bold">{props.children}</Text>
    </Pressable>
  )
}
