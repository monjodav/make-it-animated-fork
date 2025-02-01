import { Stack, useRouter } from "expo-router";
import { Palette, X } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";

export default function WhatsAppLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="my-status"
        options={{
          headerShown: true,
          headerTitle: "",
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
                onPress={() => Alert.alert("Change typeface")}
              >
                <Text className="text-neutral-200 font-bold">T</Text>
              </Pressable>
              <Pressable
                className="w-9 h-9 rounded-full bg-neutral-950/40 items-center justify-center"
                onPress={() => Alert.alert("Change color")}
              >
                <Palette size={18} color="lightgray" />
              </Pressable>
            </View>
          ),
          headerTransparent: true,
          animation: "none",
        }}
      />
    </Stack>
  );
}
