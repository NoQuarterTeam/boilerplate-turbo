import { Link } from "expo-router"
import { ScrollView, Text, View } from "react-native"
import { api } from "../../lib/utils/api"

export default function Timeline() {
  const { data: taskData } = api.post.all.useQuery()
  return (
    <View className="flex rounded-lg px-6 pt-20">
      <Link href="/">Back</Link>
      <Text className="text-3xl font-extrabold">Tasks</Text>
      <View className="flex-grow">
        <View className="min-h-[500px]">
          <ScrollView>
            {taskData?.map((post) => (
              <View key={post.id} className="py-4">
                <Text className="font-semibold">{post.title}</Text>
                <Text>{post.content}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  )
}
