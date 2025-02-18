import { _padding, Controls } from "@/components/G-I/instagram/controls";
import Ionicons from "@expo/vector-icons/Ionicons";
import { X } from "lucide-react-native";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const _iconSize = 24;
const _iconColor = "#fff";

export default function Story() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1  bg-instagram-back px-2"
      style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom }}
    >
      <View
        className="flex-1 justify-between rounded-3xl bg-gray-500 overflow-hidden"
        style={styles.container}
      >
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => Alert.alert("Close")}>
            <X size={_iconSize} color={_iconColor} strokeWidth={1.5} />
          </Pressable>
          <Pressable onPress={() => Alert.alert("Flash")}>
            <Ionicons name="flash-off" size={_iconSize} color={_iconColor} />
          </Pressable>
          <Pressable onPress={() => Alert.alert("Settings")}>
            <Ionicons name="settings-sharp" size={_iconSize} color={_iconColor} />
          </Pressable>
        </View>
        <View className="pb-4 items-center">
          <Pressable onPress={() => Alert.alert("Camera")}>
            <View className="h-[60px] w-[60px] rounded-full bg-white/50 border border-white/90" />
          </Pressable>
        </View>
        {/* instagram-story-controls-animation 🔽 */}
        <Controls />
        {/* instagram-story-controls-animation 🔼 */}
      </View>
      <View className="flex-row items-center justify-between p-4">
        <View className="h-9 w-9 rounded-lg bg-instagram-front" />
        <View className="flex-row items-center gap-2">
          <View className="h-4 w-[50px] rounded-lg bg-instagram-front" />
          <View className="h-4 w-[60px] rounded-lg bg-instagram-front" />
          <View className="h-4 w-[50px] rounded-lg bg-instagram-front" />
        </View>
        <View className="h-10 w-10 rounded-full bg-instagram-front" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: _padding,
  },
});
