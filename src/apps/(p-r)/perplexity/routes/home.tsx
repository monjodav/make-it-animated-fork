import { View, Text, Pressable, Keyboard, TouchableWithoutFeedback, TextInput } from "react-native";
import { AudioLines, LayoutGrid, Mic, Plus, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { useEffect, useRef, useState } from "react";
import { AddFileModal } from "../components/add-file-modal";
import BreathingIcon from "../components/breathing-icon";
import { useAndroidNote } from "@/src/shared/lib/hooks/use-android-note";
import {
  KeyboardController,
  KeyboardEvents,
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import { DynamicHeightTextInput } from "../components/dynamic-height-text-input";
import Animated, {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useMaxKeyboardHeight } from "@/src/shared/lib/hooks/use-max-keyboard-height";

export default function Home() {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useAndroidNote(
    "Regarding Bottom Sheet Backdrop. Android doesn't reliably support blur overlays. For consistency and performance, the fallback bottom sheet interpolates background color rather than applying a blur effect."
  );

  const inputRef = useRef<TextInput>(null);
  const [offsetClosed, setOffsetClosed] = useState(0);

  const maxKeyboardHeight = useMaxKeyboardHeight();

  useEffect(() => {
    if (isModalVisible) {
      setOffsetClosed(-maxKeyboardHeight.get() + insets.bottom - 10);
      setTimeout(() => KeyboardController.dismiss(), 200);
    }
    if (!isModalVisible && offsetClosed !== 0) {
      KeyboardController.setFocusTo("current");
      setOffsetClosed(0);
    }
  }, [isModalVisible, offsetClosed]);

  const SWIPE_UP_THRESHOLD = -50;

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationY <= SWIPE_UP_THRESHOLD) {
        inputRef.current?.focus();
      }
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={panGesture}>
      <View
        className="flex-1 bg-neutral-900"
        style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 12 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <View className="flex-row px-5 items-center justify-between">
              <Pressable onPress={simulatePress}>
                <BreathingIcon />
              </Pressable>
              <LayoutGrid size={24} color="white" />
            </View>

            <Text className="text-white text-4xl text-center font-medium mt-32">perplexity</Text>
          </View>
        </TouchableWithoutFeedback>
        <KeyboardStickyView offset={{ closed: offsetClosed, opened: 24 }}>
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
            <DynamicHeightTextInput
              ref={inputRef}
              placeholder="Hello"
              className="text-3xl font-medium"
            />

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
        </KeyboardStickyView>
        {/* perplexity-bottom-sheet-backdrop-animation 🔽 */}
        <AddFileModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
        {/* perplexity-bottom-sheet-backdrop-animation 🔼 */}
      </View>
    </GestureDetector>
  );
}
