import { Menu } from "@/src/apps/(g-i)/grok/components/attach-file-menu/menu";
import { AttachFileMenuProvider } from "@/src/apps/(g-i)/grok/lib/providers/attach-file-menu";
import { Stack } from "expo-router";
import { Ghost, MenuIcon } from "lucide-react-native";
import { Alert, View, StyleSheet, Pressable } from "react-native";

export default function Layout() {
  return (
    <AttachFileMenuProvider>
      <Stack
        screenOptions={{
          headerBackground: () => <View style={StyleSheet.absoluteFill} className="bg-black " />,
        }}
      >
        <Stack.Screen
          name="chat"
          options={{
            title: "Grok",
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerLeft: () => (
              <Pressable onPress={() => Alert.alert("Menu")}>
                <MenuIcon size={20} color="white" />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable onPress={() => Alert.alert("Private Chat")}>
                <Ghost size={18} color="white" />
              </Pressable>
            ),
          }}
        />
      </Stack>
      <Menu />
    </AttachFileMenuProvider>
  );
}
