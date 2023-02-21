import { createCookieSessionStorage } from "@remix-run/node"

import { FLASH_SESSION_SECRET, IS_PRODUCTION } from "~/lib/config.server"

export const FLASH_COOKIE_KEY = IS_PRODUCTION ? "element_session_flash" : "element_session_dev_flash"

export enum FlashType {
  Error = "flashError",
  Info = "flashInfo",
}

const flashStorage = createCookieSessionStorage({
  cookie: {
    name: FLASH_COOKIE_KEY,
    secrets: [FLASH_SESSION_SECRET],
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export type FlashMessage = { title: string; description?: string }
export async function getFlashSession(request: Request) {
  const session = await flashStorage.getSession(request.headers.get("Cookie"))
  const flashError = (session.get(FlashType.Error) as FlashMessage) || null
  const flashInfo = (session.get(FlashType.Info) as FlashMessage) || null

  const commit = () => flashStorage.commitSession(session)
  const createFlash = (type: FlashType, message: string, description?: string) => {
    session.flash(type, { title: message, description })
    return commit()
  }
  return {
    flash: { flashError, flashInfo },
    createFlash,
    commit,
    session,
  }
}
