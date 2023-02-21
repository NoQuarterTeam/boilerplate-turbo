import { ActionArgs, json, LoaderArgs, MetaFunction, redirect } from "@remix-run/node"
import { z } from "zod"

import { Form, FormButton, FormField } from "~/components/ui/Form"
import { db } from "~/lib/db.server"
import { validateFormData } from "~/lib/form"
import { badRequest } from "~/lib/remix"

import { requireUser } from "~/services/auth/auth.server"
import { getUserSession } from "~/services/session/session.server"

export const meta: MetaFunction = () => {
  return { title: "New post" }
}

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUserSession(request)
  if (!user) redirect("/posts")
  return json(null)
}

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUser(request)
  const formData = await request.formData()
  const schema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
  })
  const { data, fieldErrors } = await validateFormData(schema, formData)

  if (fieldErrors) return badRequest({ fieldErrors, data })
  await db.post.create({ data: { ...data, user: { connect: { id: userId } } } })
  return redirect("/posts")
}

export default function Posts() {
  return (
    <div className="p-10">
      <h1 className="text-center text-5xl">New post</h1>
      <div className="m-auto max-w-md">
        <Form method="post" replace>
          <div className="stack">
            <FormField name="title" label="Title" />
            <FormField name="content" label="Content" />
            <FormButton>Save</FormButton>
          </div>
        </Form>
      </div>
    </div>
  )
}
