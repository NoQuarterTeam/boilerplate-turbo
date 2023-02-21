import type { User } from "@boilerplate/database/types"

import { FULL_WEB_URL } from "~/lib/config.server"
import { createToken } from "~/lib/jwt.server"
import { mailer } from "~/lib/mailer.server"

import { type CurrentUser } from "../auth/auth.server"

export async function sendResetPasswordEmail(user: User, token: string) {
  try {
    if (!user.email) return
    await mailer.send({
      templateId: "d-efeeebd841dd48768ab7f4ac9907d2f1",
      to: user.email,
      variables: {
        link: `${FULL_WEB_URL}/reset-password/${token}`,
      },
    })
  } catch (error) {
    console.log(error)
  }
}

export async function sendEmailVerification(user: CurrentUser) {
  try {
    if (!user.email) return
    const token = createToken({ id: user.id }, { expiresIn: "30 mins" })
    await mailer.send({
      templateId: "d-aef1cdef55324a45ae6be3b3ae026124",
      to: user.email,
      variables: {
        subject: "Verify email",
        text: "Click below to verify your email",
        linkText: "Verify",
        linkUrl: `${FULL_WEB_URL}/api/email-verification/${token}`,
      },
    })
  } catch (error) {
    console.log(error)
  }
}
export async function sendPasswordChangedEmail(user: User) {
  try {
    if (!user.email) return
    await mailer.send({
      templateId: "d-c33ce68972604e0d9ca5e7732c771926",
      to: user.email,
    })
  } catch (error) {
    console.log(error)
  }
}
