import type { ActionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { z } from "zod"

import { validateFormData } from "~/lib/form"
import { badRequest } from "~/lib/remix"
import { createSignedUrl } from "~/services/s3/s3.server"

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const creatSignedUrlSchema = z.object({ key: z.string().min(1), contentType: z.string().min(1) })
  const { data, fieldErrors } = await validateFormData(creatSignedUrlSchema, formData)
  if (fieldErrors) return badRequest({ fieldErrors, data })
  return json(createSignedUrl(data))
}
