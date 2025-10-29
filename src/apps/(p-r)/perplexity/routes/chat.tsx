import { View, Pressable, Text, Keyboard } from "react-native";
import {
  Share2,
  Bookmark,
  MoreHorizontal,
  Copy,
  RefreshCw,
  Snowflake,
  ArrowLeft,
  Upload,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { useDrawerControl } from "@/src/shared/lib/hooks/use-drawer-control";
import AnimatedInput from "../components/animated-input";

export default function Chat() {
  const insets = useSafeAreaInsets();

  const { openDrawer } = useDrawerControl();

  return (
    <View className="flex-1 bg-neutral-900" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="px-4 pb-2">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={openDrawer}
              className="p-2 rounded-full bg-neutral-800 items-center justify-center"
            >
              <ArrowLeft size={18} color="white" />
            </Pressable>

            <View className="flex-row items-center gap-3">
              <Pressable
                style={{ borderCurve: "continuous" }}
                onPress={simulatePress}
                className="px-4 py-2 rounded-2xl bg-cyan-950 border border-cyan-800/50"
              >
                <Text className="text-cyan-500 font-medium">Sign in</Text>
              </Pressable>
              <Pressable
                onPress={simulatePress}
                className="p-2 rounded-full bg-neutral-800 items-center justify-center"
              >
                <Upload size={18} color="white" />
              </Pressable>
              <Pressable
                onPress={simulatePress}
                className="p-2 rounded-full bg-neutral-800 items-center justify-center"
              >
                <Bookmark size={18} color="white" />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="px-4">
          <Text className="text-white text-3xl font-semibold mt-3">Hello</Text>

          <View className="mt-3">
            <View
              style={{ borderCurve: "continuous" }}
              className="self-start flex-row items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/70 border border-neutral-700/60"
            >
              <Snowflake size={14} color="white" />
              <Text className="text-white text-sm">Perplexity</Text>
            </View>
          </View>

          <Text className="text-white text-lg font-medium mt-6">
            Hello! How can I assist you today?
          </Text>

          <View className="flex-row items-center mt-4">
            <View className="flex-row items-center gap-5">
              <Pressable onPress={simulatePress}>
                <Share2 size={18} color="grey" />
              </Pressable>
              <Pressable onPress={simulatePress}>
                <RefreshCw size={18} color="grey" />
              </Pressable>
              <Pressable onPress={simulatePress}>
                <Copy size={18} color="grey" />
              </Pressable>
            </View>
            <View className="flex-1" />
            <Pressable onPress={simulatePress} className="opacity-80">
              <MoreHorizontal size={20} color="grey" />
            </Pressable>
          </View>
        </View>

        <Pressable className="flex-1" onPress={() => Keyboard.dismiss()} />
        <View className="flex-1">
          <AnimatedInput />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
