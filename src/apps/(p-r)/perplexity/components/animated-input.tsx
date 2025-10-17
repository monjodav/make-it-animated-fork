import { Pressable, TextInput, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  withTiming,
  withSpring,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Mic, PenLine, Plus, Search } from "lucide-react-native";
import { useKeyboardAnimationMetrics } from "../lib/hooks/use-keyboard-animation-metrics";

const INPUT_REVEAL_VERTICAL_SPACING = 24;

const AnimatedInput = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  const { keyboardHeightProgress, keyboardFinalHeight, keyboardIsShowing } =
    useKeyboardAnimationMetrics();

  const rKeyboardHeight = useDerivedValue(() => Math.max(1, keyboardFinalHeight.get()));
  const rKeyboardCurrent = useDerivedValue(() => Math.max(0, keyboardHeightProgress.get()));
  const rKeyboardRatio = useDerivedValue(() =>
    Math.min(1, rKeyboardCurrent.get() / rKeyboardHeight.get())
  );

  const rKeyboardThresholdedRevealProgress = useDerivedValue(() => {
    const finalKeyboardHeight = rKeyboardHeight.get();
    const threshold = finalKeyboardHeight / 3;
    const currentKeyboardHeight = rKeyboardCurrent.get();
    const isShowing = keyboardIsShowing.get() === 1;

    if (isShowing) {
      return interpolate(
        currentKeyboardHeight,
        [0, threshold, finalKeyboardHeight],
        [0, 0, 1],
        Extrapolation.CLAMP
      );
    } else {
      const start = Math.max(0, finalKeyboardHeight - threshold);
      return interpolate(
        currentKeyboardHeight,
        [0, start, finalKeyboardHeight],
        [0, 1, 1],
        Extrapolation.CLAMP
      );
    }
  });

  const yBounce = useSharedValue(0);

  const rInputBarAnimatedStyle = useAnimatedStyle(() => {
    const keyboardHeight = rKeyboardHeight.get();
    const translateEnd = -(keyboardHeight - bottomInset + 10);
    const translateY = rKeyboardThresholdedRevealProgress.get() * translateEnd;
    return { transform: [{ translateY }] };
  }, [bottomInset]);

  const penInitialWidth = useSharedValue(0);
  const baseRowHeight = useSharedValue(0);
  const hiddenRowHeight = useSharedValue(0);

  const rPenBtnAnimatedStyle = useAnimatedStyle(() => {
    const keyboardProgressRatio = rKeyboardRatio.get();
    const isShowing = keyboardIsShowing.get() === 1;
    const targetX = 220;

    const revealProgress = rKeyboardThresholdedRevealProgress.get();
    const slide = isShowing ? keyboardProgressRatio : revealProgress;

    const widthFactor = isShowing ? 1 - keyboardProgressRatio : 1 - revealProgress;

    const translateX = slide * targetX;
    const baseWidth = penInitialWidth.get() || 56;
    const width = Math.max(0, baseWidth * widthFactor);
    const marginLeft = 8 * widthFactor;
    return { width, marginLeft, transform: [{ translateX }] };
  }, []);

  const rInputContainerStyle = useAnimatedStyle(() => {
    const baseHeight = baseRowHeight.get() || 62;
    const extra = (hiddenRowHeight.get() || 0) + INPUT_REVEAL_VERTICAL_SPACING;
    const height = Math.max(0, baseHeight + rKeyboardThresholdedRevealProgress.get() * extra);

    return { height, transform: [{ translateY: yBounce.get() }] };
  }, []);

  const rMicFloatingStyle = useAnimatedStyle(() => {
    const translateY =
      rKeyboardThresholdedRevealProgress.get() *
      ((hiddenRowHeight.get() || 0) + INPUT_REVEAL_VERTICAL_SPACING);
    return {
      transform: [{ translateY }],
    };
  }, []);

  useAnimatedReaction(
    () => rKeyboardThresholdedRevealProgress.get(),
    (current, prev) => {
      if (prev != null && prev > 0.01 && current <= 0.01) {
        yBounce.set(0);
        yBounce.set(
          withSequence(
            withTiming(2, { duration: 180, easing: Easing.out(Easing.cubic) }),
            withSpring(0, { stiffness: 220, damping: 24, mass: 1 })
          )
        );
      }
    }
  );

  return (
    <Animated.View
      style={[{ paddingBottom: bottomInset }, rInputBarAnimatedStyle]}
      className="px-3 pt-2 mt-auto"
    >
      <View className="flex-row items-center">
        <Animated.View
          style={[{ borderCurve: "continuous", overflow: "hidden" }, rInputContainerStyle]}
          className="flex-1 bg-neutral-800 rounded-[30px] border border-neutral-700/50 p-[16px]"
          onLayout={(e) => {
            const height = e.nativeEvent.layout.height;
            if (height > 0 && baseRowHeight.get() === 0) baseRowHeight.set(height);
          }}
        >
          <View className="flex-row items-center justify-between ">
            <TextInput
              placeholder="Ask a follow up..."
              placeholderTextColor="grey"
              className=" flex-1 text-neutral-500 text-lg font-medium"
              selectionColor="#ffffff"
            />

            <Pressable
              pointerEvents="none"
              style={{ opacity: 0 }}
              className="p-2 rounded-full items-center justify-center bg-neutral-700/90"
            >
              <Mic size={18} color="white" />
            </Pressable>
          </View>

          <Animated.View
            style={[{ position: "absolute", right: 14, top: 14, zIndex: 1 }, rMicFloatingStyle]}
          >
            <Pressable
              onPress={simulatePress}
              className="p-2 rounded-full items-center justify-center bg-neutral-700/90"
            >
              <Mic size={18} color="white" />
            </Pressable>
          </Animated.View>
          <View
            className="flex-row items-center gap-3 mt-6"
            onLayout={(e) => {
              const height = e.nativeEvent.layout.height;
              if (height > hiddenRowHeight.get()) hiddenRowHeight.set(height);
            }}
          >
            <Pressable
              onPress={simulatePress}
              className="p-2 rounded-full bg-neutral-700 items-center justify-center"
            >
              <Plus size={18} color="white" />
            </Pressable>
            <Pressable
              onPress={simulatePress}
              className="p-2 rounded-full bg-neutral-700 items-center justify-center"
            >
              <Search size={18} color="white" />
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View
          style={rPenBtnAnimatedStyle}
          onLayout={(e) => {
            const width = e.nativeEvent.layout.width;
            if (width > penInitialWidth.get()) penInitialWidth.set(width);
          }}
        >
          <Pressable
            onPress={simulatePress}
            className="p-5 rounded-full items-center justify-center bg-neutral-800 border border-neutral-700/50"
          >
            <PenLine size={20} color="white" />
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default AnimatedInput;
