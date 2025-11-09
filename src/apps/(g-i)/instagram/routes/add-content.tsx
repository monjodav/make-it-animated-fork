import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { _padding, Controls } from "../components/controls";
import Ionicons from "@expo/vector-icons/Ionicons";
import { X } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

// instagram-story-controls-animation 🔽

const _iconSize = 24;
const _iconColor = "#fff";

export default function AddContent() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1  bg-instagram-back px-2" style={{ paddingTop: insets.top + 12 }}>
      {/* Main camera preview container - rounded corners create Instagram's signature story UI */}
      <View
        className="flex-1 justify-between rounded-3xl bg-gray-500 overflow-hidden"
        style={styles.container}
      >
        <Image
          style={StyleSheet.absoluteFillObject}
          placeholder={{ blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj" }}
        />
        {/* Top toolbar - positioned at safe area top for thumb accessibility */}
        <View className="flex-row items-center justify-between">
          <Pressable onPress={simulatePress}>
            <X size={_iconSize} color={_iconColor} strokeWidth={1.5} />
          </Pressable>
          <Pressable onPress={simulatePress}>
            <Ionicons name="flash-off" size={_iconSize} color={_iconColor} />
          </Pressable>
          <Pressable onPress={simulatePress}>
            <Ionicons name="settings-sharp" size={_iconSize} color={_iconColor} />
          </Pressable>
        </View>
        {/* Capture button - centered for easy thumb reach from either hand */}
        <View className="pb-4 items-center">
          <Pressable onPress={simulatePress}>
            <View className="h-[60px] w-[60px] rounded-full bg-white/50 border border-white/90" />
          </Pressable>
        </View>
        {/* Animated controls component - handles position switching and stacking animations */}
        <Controls />
      </View>
      {/* Bottom navigation area - outside camera preview for persistent access */}
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

// instagram-story-controls-animation 🔼
