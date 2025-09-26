import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Home() {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  return (
    <View
      className="flex-1 bg-linear-back"
      style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }}
    >
      <Pressable onPress={() => router.push("/linear/home/dev-issues")}>
        <Text className="text-white">Go to dev issues</Text>
      </Pressable>
    </View>
  );
}
