import * as React from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Links, LiveReload, Meta, Outlet, Scripts, useCatch, useLoaderData, useMatches } from "@remix-run/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { join } from "~/lib/tailwind"
import appStyles from "~/styles/app.css"
import toastStyles from "~/styles/toast.css"

import { FlashMessage } from "./components/FlashMessage"
import { Toaster } from "./components/ui/Toast"
import { type Theme } from "./lib/theme"
import { getFlashSession } from "./services/session/flash.server"
import { getThemeSession } from "./services/session/theme.server"

export const meta: MetaFunction = () => {
  return { title: "Boilerplate" }
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: appStyles },
    { rel: "stylesheet", href: toastStyles, async: true },
  ]
}

export const loader = async ({ request }: LoaderArgs) => {
  const { flash, commit } = await getFlashSession(request)
  const { getTheme, commit: commitTheme } = await getThemeSession(request)
  return json(
    { flash, theme: getTheme() },
    {
      headers: [
        ["Set-Cookie", await commit()],
        ["Set-Cookie", await commitTheme()],
      ],
    },
  )
}

const queryClient = new QueryClient()

export default function App() {
  const { flash, theme } = useLoaderData<typeof loader>()
  const matches = useMatches()

  const shouldDisableScripts = matches.some((match) => match.handle?.disableScripts)

  return (
    <Document theme={theme} shouldDisableScripts={shouldDisableScripts}>
      <Toaster>
        <QueryClientProvider client={queryClient}>
          <Tooltip.Provider>
            <FlashMessage flash={flash} />
            <Outlet />
          </Tooltip.Provider>
        </QueryClientProvider>
      </Toaster>
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error("Boundary:", error)
  return (
    <Document theme="dark" shouldDisableScripts={false}>
      <div className="vstack h-screen justify-center p-20">
        <img alt="logo" src="/logo.png" className="sq-24" />
        <h1>Oops, there was an error.</h1>
        <p>{error.message}</p>
      </div>
    </Document>
  )
}

export function CatchBoundary() {
  let caught = useCatch()
  let message
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>
      break
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Document theme="dark" shouldDisableScripts={false}>
      <div className="vstack h-screen justify-center p-20">
        <img alt="logo" src="/logo.png" className="sq-24" />
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </div>
    </Document>
  )
}

interface DocumentProps {
  children: React.ReactNode
  theme: Theme
  shouldDisableScripts: boolean
}

function Document({ theme, children, shouldDisableScripts }: DocumentProps) {
  return (
    <html lang="en" className={join(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="user-scalable=no, initial-scale=1, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-gray-800">
        {children}
        {!shouldDisableScripts && <Scripts />}
        <LiveReload />
      </body>
    </html>
  )
}
