import { Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, View, StyleSheet } from "react-native";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

const HEADER_TINT_COLOR = "#e5e5e5";

const HeaderLeft = () => {
  return (
    <Pressable onPress={simulatePress} hitSlop={15}>
      <ArrowLeft size={22} color={HEADER_TINT_COLOR} />
    </Pressable>
  );
};

const HeaderBackground = () => (
  <View
    style={StyleSheet.absoluteFill}
    className="bg-[#1C1D24] border-b-[0.5px] border-gray-700/25"
  />
);

export default function DiscordLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="clips"
        options={{
          headerShown: true,
          title: "Clips",
          headerTitleAlign: "center",
          headerTintColor: HEADER_TINT_COLOR,
          headerLeft: () => <HeaderLeft />,
          headerBackground: () => <HeaderBackground />,
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          headerShown: true,
          title: "Language",
          headerTitleAlign: "center",
          headerTintColor: HEADER_TINT_COLOR,
          headerLeft: () => <HeaderLeft />,
          headerBackground: () => <HeaderBackground />,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          headerShown: true,
          title: "Account",
          headerTitleAlign: "center",
          headerTintColor: HEADER_TINT_COLOR,
          headerLeft: () => <HeaderLeft />,
          headerBackground: () => <HeaderBackground />,
        }}
      />
    </Stack>
  );
}
