import { initTRPC, TRPCError } from "@trpc/server"
import { inferAsyncReturnType } from "@trpc/server"
import * as trpcFetch from "@trpc/server/adapters/fetch"
import { ZodError } from "zod"
import { prisma, User } from "@boilerplate/database"
import { decodeAuthToken } from "./lib/jwt"

export async function createContext({ req }: trpcFetch.FetchCreateContextFnOptions) {
  const headers = new Headers(req.headers)
  const authToken = headers.get("authorization")
  let user: User | null = null
  if (authToken) {
    const payload = decodeAuthToken(authToken.split("Bearer ")[1])
    user = await prisma.user.findUnique({ where: { id: payload.id } })
  }
  return { req, prisma, user }
}
export type Context = inferAsyncReturnType<typeof createContext>

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      // infers the `user` as non-nullable
      user: ctx.user,
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
