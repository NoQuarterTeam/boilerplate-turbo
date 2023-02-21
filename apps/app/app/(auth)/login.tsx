import AsyncStorage from "@react-native-async-storage/async-storage"
import { Link, useRouter } from "expo-router"
import * as React from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import { api, AUTH_TOKEN } from "../../lib/utils/api"

export default function Login() {
  const queryClient = api.useContext()
  const router = useRouter()
  const login = api.auth.login.useMutation({
    onSuccess: async (data) => {
      await AsyncStorage.setItem(AUTH_TOKEN, data.token)
      queryClient.auth.me.setData(undefined, data.user)
      router.replace("/")
    },
  })
  const [email, setEmail] = React.useState("jack@noquarter.co")
  const [password, setPassword] = React.useState("password")

  return (
    <View className="p-10">
      <Text className="mb-4 text-3xl font-extrabold">Login</Text>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} className="bg-gray-75 w-full p-4" />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} className="bg-gray-75 w-full p-4" />
      <Pressable
        disabled={login.isLoading}
        onPress={() => login.mutate({ email, password })}
        className="bg-primary-500 rounded-md p-4"
      >
        <Text className="text-center text-lg font-bold">{login.isLoading ? "logging in..." : "Login"}</Text>
      </Pressable>
      <Link href="/">Home</Link>
    </View>
  )
}
