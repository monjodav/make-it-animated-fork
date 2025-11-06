import { View, Text, Pressable } from "react-native";
import { AudioLines, LayoutGrid, Mic, Plus, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { useState } from "react";
import { AddFileModal } from "../components/add-file-modal";
import BreathingIcon from "../components/breathing-icon";
import { useAndroidNote } from "@/src/shared/lib/hooks/use-android-note";
import WithShimmer from "@/src/shared/components/with-shimmer";

export default function Home() {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useAndroidNote(
    "Regarding Bottom Sheet Backdrop. Android doesn't reliably support blur overlays. For consistency and performance, the fallback bottom sheet interpolates background color rather than applying a blur effect."
  );

  return (
    <View
      className="flex-1 bg-neutral-900"
      style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 12 }}
    >
      {/* perplexity-header-animation 🔽 */}
      {/* Header row: BreathingIcon provides subtle pulsing animation to draw attention
          The breathing effect creates a gentle, non-intrusive visual cue */}
      <View className="flex-row px-5 items-center justify-between">
        <Pressable onPress={simulatePress}>
          <BreathingIcon />
        </Pressable>
        <LayoutGrid size={24} color="white" />
      </View>

      {/* Logo section: Shimmer animation adds premium feel with gradient sweep
          delay=2s: waits before starting shimmer, duration=4s: sweep speed
          angle=75deg: diagonal gradient direction, colors: neutral gray palette */}
      <View className="pt-40 items-center justify-center px-5">
        <WithShimmer
          delay={2}
          duration={4}
          angle={75}
          colors={{ start: "#D9D9DB", middle: "#71717a", end: "#D9D9DB" }}
        >
          <Text className="text-4xl">perplexity</Text>
        </WithShimmer>
      </View>
      {/* perplexity-header-animation 🔼 */}

      <Pressable
        onPress={simulatePress}
        style={{ borderCurve: "continuous" }}
        className="mx-6 mt-auto -mb-12 bg-cyan-950 rounded-3xl border border-cyan-800/50 items-center"
      >
        <Text className="text-cyan-500 mt-3 mb-14">Sign In</Text>
      </Pressable>

      <View
        style={{ borderCurve: "continuous" }}
        className="mx-4 p-3 bg-neutral-800 rounded-3xl border border-neutral-700/50"
      >
        <Text className="text-neutral-500 text-lg ml-1 mt-1">Ask anything...</Text>

        <View className="flex-row justify-between mt-5">
          <View className="flex-row items-center gap-3">
            {/* perplexity-bottom-sheet-backdrop-animation 🔽 */}
            <Pressable
              onPress={() => setIsModalVisible(true)}
              className="p-2 rounded-full bg-neutral-700 items-center justify-center"
            >
              <Plus size={18} color="white" />
            </Pressable>
            {/* perplexity-bottom-sheet-backdrop-animation 🔼 */}
            <Pressable
              onPress={simulatePress}
              className="p-2 rounded-full bg-neutral-700 items-center justify-center"
            >
              <Search size={18} color="white" />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={simulatePress}
              className="p-2 rounded-full bg-neutral-700 items-center justify-center"
            >
              <Mic size={18} color="white" />
            </Pressable>
            <Pressable
              onPress={simulatePress}
              className="p-2 rounded-full bg-cyan-400 items-center justify-center"
            >
              <AudioLines size={18} color="black" />
            </Pressable>
          </View>
        </View>
      </View>
      {/* perplexity-bottom-sheet-backdrop-animation 🔽 */}
      <AddFileModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
      {/* perplexity-bottom-sheet-backdrop-animation 🔼 */}
    </View>
  );
}
