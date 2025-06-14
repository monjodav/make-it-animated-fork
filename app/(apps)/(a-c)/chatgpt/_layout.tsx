import { Stack } from "expo-router";
import { AlignLeft, SquarePen } from "lucide-react-native";
import { Alert, Pressable, StyleSheet, View } from "react-native";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="chat"
        options={{
          title: "ChatGPT",
          headerTintColor: "white",
          headerLeft: () => (
            <Pressable onPress={() => Alert.alert("Open Menu")}>
              <AlignLeft size={20} color="white" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => Alert.alert("New Chat")}>
              <SquarePen size={20} color="white" />
            </Pressable>
          ),
          headerBackground: () => (
            <View
              style={StyleSheet.absoluteFill}
              className="bg-black border-b-[0.5px] border-white/15"
            />
          ),
        }}
      />
    </Stack>
  );
}
