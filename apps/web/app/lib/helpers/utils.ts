export const isBrowser = typeof window !== "undefined"

export const isMobile =
  isBrowser && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
