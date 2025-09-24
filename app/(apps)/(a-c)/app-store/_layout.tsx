import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Stack, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { Platform, Pressable, View, Text } from "react-native";

export default function AppStoreLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="app"
        options={{
          title: "App",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#f5f5f5",
          },

          headerStyle: {
            backgroundColor: "black",
          },
          headerTransparent: Platform.OS === "ios" ? true : false,
          headerBackground: Platform.OS === "ios" ? () => <></> : undefined,
          headerLeft: () => (
            <Pressable
              className="w-9 h-9 rounded-full bg-neutral-950/40 items-center justify-center"
              onPress={router.back}
            >
              <X size={22} color="lightgray" />
            </Pressable>
          ),
          headerRight: () => (
            <View className="flex-row items-center gap-3">
              <Pressable
                className="w-9 h-9 rounded-full bg-neutral-950/40 items-center justify-center"
                onPress={simulatePress}
              >
                <Text className="text-neutral-200 font-bold">T</Text>
              </Pressable>
            </View>
          ),
        }}
      />
    </Stack>
  );
}
