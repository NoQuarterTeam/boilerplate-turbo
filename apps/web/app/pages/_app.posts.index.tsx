import { json, LoaderArgs, MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { BiPlusCircle } from "react-icons/bi"
import { db } from "~/lib/db.server"

export const meta: MetaFunction = () => {
  return { title: "Posts" }
}

export const loader = async (_: LoaderArgs) => {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } })
  return json(posts)
}
export default function Posts() {
  const posts = useLoaderData<typeof loader>()
  return (
    <div className="p-10">
      <div className="center flex-row">
        <h1 className="pr-4 text-center text-5xl">Posts</h1>
        <Link to="new">
          <BiPlusCircle className="sq-8" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 ">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border-gray-75 flex flex-col space-y-2 rounded-lg border bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
          >
            <div className="text-2xl">{post.title}</div>
            <div className="text-sm">{post.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
