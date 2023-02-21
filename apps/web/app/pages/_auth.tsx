import type { LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Link, Outlet } from "@remix-run/react"

import { db } from "~/lib/db.server"

import { getUserSession } from "~/services/session/session.server"

export const handle = {
  disableScripts: false,
}

export const headers = () => {
  return {
    "Cache-Control": "max-age=3600, s-maxage=86400",
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  const { userId } = await getUserSession(request)
  if (!userId) return null
  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (user) return redirect("/")
  return null
}

export default function AuthLayout() {
  return (
    <div className="center flex-col pt-10 md:pt-12">
      <div className="vstack w-full">
        <div className="vstack w-full max-w-sm space-y-8 bg-white p-4 dark:bg-gray-800">
          <Link to="/" className="text-4xl">
            Turbo Boilerplate
          </Link>
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
