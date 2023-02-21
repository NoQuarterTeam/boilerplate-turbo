import jwt from "jsonwebtoken"
import { z } from "zod"

const AUTH_TOKEN = process.env.APP_AUTH_SECRET

export const createAuthToken = (payload: { id: string }) => {
  if (!AUTH_TOKEN) throw new Error("APP_AUTH_SECRET is not defined")
  try {
    const token = jwt.sign(payload, AUTH_TOKEN, {
      issuer: "@boilerplate/api",
      audience: ["@boilerplate/app"],
      expiresIn: "8 weeks",
    })
    return token
  } catch (error) {
    // Oops
    throw error
  }
}
const authSchema = z.object({
  id: z.string(),
})

export function decodeAuthToken(token: string): { id: string } {
  if (!AUTH_TOKEN) throw new Error("APP_AUTH_SECRET is not defined")
  try {
    jwt.verify(token, AUTH_TOKEN)
    const payload = jwt.decode(token)
    const result = authSchema.parse(payload)
    return result
  } catch (error) {
    // Oops
    throw error
  }
}
