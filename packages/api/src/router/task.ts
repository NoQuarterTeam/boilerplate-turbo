import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const postRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({ take: 30, orderBy: { createdAt: "desc" } })
  }),
})
