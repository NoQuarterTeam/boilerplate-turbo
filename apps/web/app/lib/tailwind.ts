import { extendTailwindMerge, getDefaultConfig, mergeConfigs } from "tailwind-merge"
import { twJoin } from "tailwind-merge"
import { type ClassNameValue } from "tailwind-merge/dist/lib/tw-join"

const customTwMerge = extendTailwindMerge(() => {
  const config = getDefaultConfig()

  return mergeConfigs(config, {
    classGroups: {
      square: [{ sq: config.theme.space }],
    },
    conflictingClassGroups: {
      square: ["w", "h"],
    },
  })
})

export const merge = (...args: ClassNameValue[]) => customTwMerge(args)
export const join = (...args: ClassNameValue[]) => twJoin(args)
