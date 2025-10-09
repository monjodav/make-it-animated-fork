import { Menu } from "@/src/apps/(g-i)/grok/components/attach-file-menu/menu";
import { AttachFileMenuProvider } from "@/src/apps/(g-i)/grok/lib/providers/attach-file-menu";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Stack } from "expo-router";
import { Ghost, MenuIcon } from "lucide-react-native";
import { View, StyleSheet, Pressable } from "react-native";

// grok-attach-file-menu-animation 🔽

export default function Layout() {
  return (
    <AttachFileMenuProvider>
      <Stack>
        <Stack.Screen
          name="chat"
          options={{
            title: "Grok",
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerLeft: () => (
              <Pressable onPress={simulatePress}>
                <MenuIcon size={20} color="white" />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable onPress={simulatePress}>
                <Ghost size={18} color="white" />
              </Pressable>
            ),
            headerBackground: () => <View style={StyleSheet.absoluteFill} className="bg-black " />,
          }}
        />
        <Stack.Screen name="paywall" options={{ headerShown: false }} />
      </Stack>
      <Menu />
    </AttachFileMenuProvider>
  );
}

// grok-attach-file-menu-animation 🔼
