import { authRouter } from "./router/auth"
import { postRouter } from "./router/task"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter