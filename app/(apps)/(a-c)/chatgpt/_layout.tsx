import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { DrawerActions } from "@react-navigation/routers";
import { Stack, useNavigation } from "expo-router";
import { AlignLeft, SquarePen } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

export default function Layout() {
  const navigation = useNavigation();

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="chat"
        options={{
          title: "ChatGPT",
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerLeft: () => (
            <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <AlignLeft size={20} color="white" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={simulatePress}>
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
