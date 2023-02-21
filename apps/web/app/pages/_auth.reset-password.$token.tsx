import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Link, useParams } from "@remix-run/react"
import { z } from "zod"

import { Form, FormButton, FormError, FormField } from "~/components/ui/Form"
import { db } from "~/lib/db.server"
import { validateFormData } from "~/lib/form"
import { decryptToken } from "~/lib/jwt.server"
import { badRequest } from "~/lib/remix"
import { hashPassword } from "~/services/auth/password.server"
import { FlashType, getFlashSession } from "~/services/session/flash.server"
import { sendPasswordChangedEmail } from "~/services/user/user.mailer.server"

export const headers = () => {
  return {
    "Cache-Control": "max-age=3600, s-maxage=86400",
  }
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(8, "Must be at least 8 characters"),
  })
  const { data, fieldErrors } = await validateFormData(resetPasswordSchema, formData)
  if (fieldErrors) return badRequest({ fieldErrors, data })

  const payload = decryptToken<{ id: string }>(data.token)
  const hashedPassword = await hashPassword(data.password)
  const user = await db.user.update({
    where: { id: payload.id },
    data: { password: hashedPassword },
  })
  await sendPasswordChangedEmail(user)
  const { createFlash } = await getFlashSession(request)
  return redirect("/login", {
    headers: { "Set-Cookie": await createFlash(FlashType.Info, "Password changed") },
  })
}

export default function ResetPassword() {
  const { token } = useParams()

  return (
    <Form method="post">
      <div className="stack">
        <div>
          <h1 className="text-4xl font-bold">Reset password</h1>
          <p>Enter a new password below.</p>
        </div>
        <input name="token" type="hidden" value={token} />
        <FormField required label="Password" name="password" type="password" placeholder="********" />
        <FormError />
        <FormButton className="w-full">Reset</FormButton>
        <Link to="/login">Login</Link>
      </div>
    </Form>
  )
}
