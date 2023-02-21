import { SafeAreaProvider } from "react-native-safe-area-context"
import { Slot } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { TRPCProvider } from "../lib/utils/api"

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <Slot />
        <StatusBar />
      </SafeAreaProvider>
    </TRPCProvider>
  )
}
