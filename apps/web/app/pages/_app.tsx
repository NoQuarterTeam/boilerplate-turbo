import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Outlet, useLoaderData, useSubmit } from "@remix-run/react"
import { Button } from "~/components/ui/Button"
import { LinkButton } from "~/components/ui/LinkButton"
import { NavLink } from "~/components/ui/NavLink"
import { getUserSession } from "~/services/session/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  const { userId } = await getUserSession(request)
  return json(userId)
}

export default function HomeLayout() {
  const userId = useLoaderData<typeof loader>()
  const logoutSubmit = useSubmit()
  return (
    <div>
      <div className="border-gray-75 flex justify-between border-b p-4 dark:border-gray-800">
        <div className="hstack">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/posts">Posts</NavLink>
        </div>
        {!userId ? (
          <div className="hstack">
            <LinkButton to="/register" colorScheme="primary">
              Register
            </LinkButton>
            <LinkButton to="/login">Login</LinkButton>
          </div>
        ) : (
          <Button onClick={() => logoutSubmit(null, { method: "post", action: "/logout" })}>Logout</Button>
        )}
      </div>
      <Outlet />
    </div>
  )
}
