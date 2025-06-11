import { Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, View, StyleSheet, Alert } from "react-native";

export default function DiscordLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="clips"
        options={{
          headerShown: true,
          title: "Clips",
          headerTintColor: "#e5e5e5",
          headerLeft: () => (
            <Pressable onPress={() => Alert.alert("Go back")}>
              <ArrowLeft size={22} color="#e5e5e5" />
            </Pressable>
          ),
          headerBackground: () => (
            <View
              style={StyleSheet.absoluteFill}
              className="bg-[#1C1D24] border-b-[0.5px] border-gray-700/25"
            />
          ),
        }}
      />
    </Stack>
  );
}
