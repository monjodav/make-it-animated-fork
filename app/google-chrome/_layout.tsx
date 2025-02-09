import { Stack } from "expo-router";
import { Search } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function TabsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="tabs"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity>
              <Search size={18} color="gray" />
            </TouchableOpacity>
          ),
          // headerStyle: {

          // }
        }}
      />
    </Stack>
  );
}
