import type { MetaFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
  return { title: "Home" }
}

export default function Home() {
  return (
    <div className="center p-10">
      <h1 className="text-center text-5xl">This is the Turbo Boilerplate</h1>
    </div>
  )
}
