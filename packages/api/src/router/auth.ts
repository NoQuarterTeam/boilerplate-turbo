import { TRPCError } from "@trpc/server"
import { z } from "zod"
import bcrypt from "bcrypt"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { createAuthToken } from "../lib/jwt"

export const authRouter = createTRPCRouter({
  me: publicProcedure.query(({ ctx }) => ctx.user),
  login: publicProcedure.input(z.object({ email: z.string().email(), password: z.string() })).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({ where: { email: input.email } })
    if (!user) throw new TRPCError({ code: "BAD_REQUEST", message: "Incorrect email or password" })
    const isSamePassword = bcrypt.compareSync(input.password, user.password)
    if (!isSamePassword) throw new TRPCError({ code: "BAD_REQUEST", message: "Incorrect email or password" })
    const token = createAuthToken({ id: user.id })
    return { user, token }
  }),
})
