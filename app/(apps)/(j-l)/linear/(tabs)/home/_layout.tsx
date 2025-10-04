import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Stack } from "expo-router";
import { Settings } from "lucide-react-native";
import { Pressable, View } from "react-native";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitle: "",
        headerStyle: { backgroundColor: "#0A090C" },
        headerRight: () => (
          <Pressable className="flex-row items-center mr-4" onPress={simulatePress}>
            <Settings size={20} color="#777777" />
          </Pressable>
        ),
        headerBackground: () => <View className="absolute inset-0 bg-linear-back" />,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="dev-issues" options={{ headerShown: false }} />
    </Stack>
  );
}
