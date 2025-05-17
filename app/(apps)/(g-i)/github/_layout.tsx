import { Stack } from "expo-router";
import { Settings } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function ProfileLayout() {
  return (
    <Stack>
      {/* github-profile-header-title-animation 🔽 */}
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          headerTransparent: true,
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
      {/* github-profile-header-title-animation 🔼 */}
      {/* github-achievements-carousel-animation 🔽 */}
      <Stack.Screen
        name="achievements"
        options={{ headerShown: false, animation: "slide_from_bottom", animationDuration: 250 }}
      />
      {/* github-achievements-carousel-animation 🔼 */}
    </Stack>
  );
}
