import { Stack } from "expo-router";
import { Search } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function TabsLayout() {
  return (
    <Stack>
      {/* google-chrome-top-tabs-indicator-animation 🔽 */}
      <Stack.Screen
        name="tabs"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity>
              <Search size={18} color="gray" />
            </TouchableOpacity>
          ),
        }}
      />
      {/* google-chrome-top-tabs-indicator-animation 🔼 */}
    </Stack>
  );
}
