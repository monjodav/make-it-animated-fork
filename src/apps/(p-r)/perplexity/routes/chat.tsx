import { View, Pressable, Text, TextInput } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  Share2,
  Bookmark,
  MoreHorizontal,
  Copy,
  RefreshCw,
  Snowflake,
  Mic,
  PenLine,
  ArrowLeft,
  Upload,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { useDrawerControl } from "@/src/shared/lib/hooks/use-drawer-control";
import { KeyboardEvents, useKeyboardHandler } from "react-native-keyboard-controller";
import { useEffect } from "react";

const useGradualKeyboardAnimation = () => {
  const keyboardHeightProgress = useSharedValue(0);
  const keyboardFinalHeight = useSharedValue(0);

  useEffect(() => {
    const show = KeyboardEvents.addListener("keyboardWillShow", (e) => {
      keyboardFinalHeight.value = Math.abs(e.height);
    });

    return () => {
      show.remove();
    };
  }, []);
  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        keyboardHeightProgress.value = e.height;
      },
      onEnd: (e) => {
        "worklet";
        keyboardHeightProgress.value = e.height;
      },
    },
    []
  );
  return { keyboardHeightProgress, keyboardFinalHeight };
};

export default function Chat() {
  const insets = useSafeAreaInsets();

  const bottomInset = insets.bottom;
  const { openDrawer } = useDrawerControl();
  const { keyboardHeightProgress, keyboardFinalHeight } = useGradualKeyboardAnimation();

  const rInputBarAnimatedStyle = useAnimatedStyle(() => {
    const keyboardHeight = keyboardFinalHeight.get();
    const threshold = keyboardHeight / 3;

    const translateEnd = -(keyboardHeight - bottomInset + 10);
    const translateY = interpolate(
      keyboardHeightProgress.get(),
      [0, threshold, keyboardHeight],
      [0, 0, translateEnd],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }] };
  }, [bottomInset]);

  return (
    <View className="flex-1 bg-neutral-900">
      <View style={{ paddingTop: insets.top }} className="px-4 pb-2">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={openDrawer}
            className="p-2 rounded-full bg-neutral-800 items-center justify-center"
          >
            <ArrowLeft size={18} color="white" />
          </Pressable>

          <View className="flex-row items-center gap-2">
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

      <View className="flex-1">
        <Animated.View
          style={[{ paddingBottom: bottomInset }, rInputBarAnimatedStyle]}
          className="px-3 pt-2 mt-auto"
        >
          <View className="flex-row items-center gap-2">
            <View
              style={{ borderCurve: "continuous" }}
              className="flex-1 flex-row items-center justify-between bg-neutral-800 rounded-full border border-neutral-700/50 p-4"
            >
              <TextInput
                placeholder="Ask a follow up..."
                placeholderTextColor="grey"
                className="text-neutral-500 text-lg font-medium ml-3"
                selectionColor="#ffffff"
              />

              <Pressable
                onPress={simulatePress}
                className="p-2 rounded-full items-center justify-center bg-neutral-700/90"
              >
                <Mic size={18} color="white" />
              </Pressable>
            </View>

            <Pressable
              onPress={simulatePress}
              className="p-5 rounded-full items-center justify-center bg-neutral-800 border border-neutral-700/50"
            >
              <PenLine size={20} color="white" />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
