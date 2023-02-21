import AsyncStorage from "@react-native-async-storage/async-storage"
import { Link } from "expo-router"
import { Text, View } from "react-native"
import { Button } from "../components/Button"

import { api, AUTH_TOKEN } from "../lib/utils/api"

export default function Home() {
  const { data, isLoading } = api.auth.me.useQuery()
  const queryClient = api.useContext()
  const handleLogout = async () => {
    await AsyncStorage.setItem(AUTH_TOKEN, "")
    queryClient.auth.me.setData(undefined, null)
  }

  return (
    <View className="flex flex-row rounded-lg px-6 pt-20">
      <View className="flex-grow">
        {isLoading ? null : data ? (
          <View className="space-y-4">
            <Text className="text-3xl font-extrabold">Hey, {data.firstName}</Text>
            <Link href="/posts">Posts</Link>
            <Button onPress={handleLogout}>Logout</Button>
          </View>
        ) : (
          <Link href="login" className="bg-primary-400 px-4 py-2">
            Login
          </Link>
        )}
      </View>
    </View>
  )
}
