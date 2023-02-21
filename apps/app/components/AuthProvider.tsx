import { useRouter, useSegments } from "expo-router"
import * as React from "react"
import { api, RouterOutputs } from "../lib/utils/api"

// // This hook will protect the route access based on user authentication.
function useProtectedRoute(user?: RouterOutputs["auth"]["me"]) {
  const segments = useSegments()
  const router = useRouter()

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)"

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/login")
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/")
    }
  }, [user, segments])
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const { data, isLoading } = api.auth.me.useQuery()
  if (isLoading) return null
  useProtectedRoute(data)
  return <>{props.children}</>
}
