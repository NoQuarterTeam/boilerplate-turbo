import { Slot } from "expo-router"

import { AuthProvider } from "../../components/AuthProvider"

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  )
}
