import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import * as trpcFetch from "@trpc/server/adapters/fetch"
import { appRouter, createContext } from "@boilerplate/api"

function handleRequest(args: LoaderArgs | ActionArgs) {
  return trpcFetch.fetchRequestHandler({
    endpoint: "/api/trpc",
    req: args.request,
    router: appRouter,
    createContext,
  })
}

export const loader = handleRequest
export const action = handleRequest
