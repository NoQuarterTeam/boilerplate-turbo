import { createCookieSessionStorage } from "@remix-run/node"

import { IS_PRODUCTION, THEME_SESSION_SECRET } from "~/lib/config.server"
import { isTheme, type Theme } from "~/lib/theme"

export const THEME_COOKIE_KEY = IS_PRODUCTION ? "element_session_theme" : "element_session_dev_theme"

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: THEME_COOKIE_KEY,
    secrets: [THEME_SESSION_SECRET],
    sameSite: "lax",
    secure: IS_PRODUCTION,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"))
  return {
    getTheme: () => {
      const themeValue = session.get("theme")
      return isTheme(themeValue) ? themeValue : "light"
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () => themeStorage.commitSession(session),
  }
}
