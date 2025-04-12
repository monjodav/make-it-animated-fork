import { Stack } from "expo-router";
import { Settings } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

// github-profile-header-title-animation 🔽

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          title: "",
          headerTintColor: "white",
          headerRight: () => (
            <View className="flex-row items-center gap-4">
              <TouchableOpacity>
                <Settings size={18} color="dodgerblue" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Feather name="share" size={18} color="dodgerblue" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="achievements"
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}

// github-profile-header-title-animation 🔼
