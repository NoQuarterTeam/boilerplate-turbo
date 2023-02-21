import type { ActionArgs, MetaFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { z } from "zod"

import { Form, FormButton, FormError, FormField } from "~/components/ui/Form"
import { db } from "~/lib/db.server"
import { validateFormData } from "~/lib/form"
import { badRequest } from "~/lib/remix"

import { hashPassword } from "~/services/auth/password.server"

import { FlashType, getFlashSession } from "~/services/session/flash.server"
import { getUserSession } from "~/services/session/session.server"

import { sendEmailVerification } from "~/services/user/user.mailer.server"

export const meta: MetaFunction = () => {
  return { title: "Register" }
}
export const headers = () => {
  return {
    "Cache-Control": "max-age=3600, s-maxage=86400",
  }
}

enum RegisterActionMethods {
  Register = "Register",
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const action = formData.get("_action") as RegisterActionMethods | undefined

  const { createFlash } = await getFlashSession(request)
  switch (action) {
    case RegisterActionMethods.Register:
      try {
        if (formData.get("passwordConfirmation")) return redirect("/")
        const registerSchema = z.object({
          email: z.string().min(3).email("Invalid email"),
          password: z.string().min(8, "Must be at least 8 characters"),
          firstName: z.string().min(2, "Must be at least 2 characters"),
          lastName: z.string().min(2, "Must be at least 2 characters"),
        })
        const { data, fieldErrors } = await validateFormData(registerSchema, formData)
        if (fieldErrors) return badRequest({ fieldErrors, data })

        const email = data.email.toLowerCase().trim()
        const existing = await db.user.findFirst({ where: { email } })
        if (existing) return badRequest({ data, formError: "User with these details already exists" })
        const password = await hashPassword(data.password)

        const user = await db.user.create({ data: { ...data, email, password } })

        const { setUser } = await getUserSession(request)
        await sendEmailVerification(user)
        const { createFlash } = await getFlashSession(request)
        const headers = new Headers([
          ["Set-Cookie", await setUser(user.id)],
          ["Set-Cookie", await createFlash(FlashType.Info, `Welcome to the boilerplate, ${data.firstName}!`)],
        ])
        return redirect("/", { headers })
      } catch (e: any) {
        return badRequest(e.message, {
          headers: { "Set-Cookie": await createFlash(FlashType.Error, "Register error") },
        })
      }

    default:
      break
  }
}

export default function Register() {
  return (
    <div>
      <Form method="post" replace>
        <div className="stack">
          <h1 className="text-4xl font-bold">Register</h1>
          <FormField required label="Email address" name="email" placeholder="jim@gmail.com" />
          <FormField required label="Password" name="password" type="password" placeholder="********" />
          <input name="passwordConfirmation" className="hidden" />
          <FormField required label="First name" name="firstName" placeholder="Jim" />
          <FormField required label="Last name" name="lastName" placeholder="Bob" />
          <div>
            <FormButton name="_action" value={RegisterActionMethods.Register} className="w-full">
              Register
            </FormButton>
            <FormError />
          </div>

          <div className="flex justify-between">
            <Link to="/login" className="hover:opacity-70">
              Login
            </Link>
            <Link to="/forgot-password" className="hover:opacity-70">
              Forgot password?
            </Link>
          </div>
        </div>
      </Form>
    </div>
  )
}
