import { Stack, useNavigation } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, View, StyleSheet } from "react-native";
import { DrawerActions } from "@react-navigation/native";

const HeaderLeft = () => {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <ArrowLeft size={22} color="#e5e5e5" />
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
          headerTintColor: "#e5e5e5",
          headerLeft: () => <HeaderLeft />,
          headerBackground: () => <HeaderBackground />,
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          headerShown: true,
          title: "Language",
          headerTintColor: "#e5e5e5",
          headerLeft: () => <HeaderLeft />,
          headerBackground: () => <HeaderBackground />,
        }}
      />
    </Stack>
  );
}
