import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-linear-back px-4">
      <Pressable onPress={() => router.push("/linear/home/dev-issues")}>
        <Text className="text-white text-lg">Go to dev issues</Text>
      </Pressable>
    </View>
  );
}
