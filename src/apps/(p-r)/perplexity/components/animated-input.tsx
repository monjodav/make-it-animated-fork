import { Pressable, TextInput, View } from "react-native";
import React, { useEffect } from "react";
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
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardEvents, useKeyboardHandler } from "react-native-keyboard-controller";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Mic, PenLine, Plus, Search } from "lucide-react-native";

const useKeyboardAnimationMetrics = () => {
  const keyboardHeightProgress = useSharedValue(0);
  const keyboardFinalHeight = useSharedValue(0);
  const keyboardIsShowing = useSharedValue(0);

  useEffect(() => {
    const show = KeyboardEvents.addListener("keyboardWillShow", (e) => {
      keyboardFinalHeight.set(Math.abs(e.height));
      keyboardIsShowing.set(1);
    });
    const hide = KeyboardEvents.addListener("keyboardWillHide", () => {
      keyboardIsShowing.set(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        keyboardHeightProgress.set(e.height);
      },
      onEnd: (e) => {
        "worklet";
        keyboardHeightProgress.set(e.height);
      },
    },
    []
  );
  return { keyboardHeightProgress, keyboardFinalHeight, keyboardIsShowing };
};

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

  const rReveal = useDerivedValue(() => {
    const finalKeyboardHeight = rKeyboardHeight.get();
    const threshold = finalKeyboardHeight / 3;
    const currentKeyboardHeight = rKeyboardCurrent.get();
    return interpolate(
      currentKeyboardHeight,
      [0, threshold, finalKeyboardHeight],
      [0, 0, 1],
      Extrapolation.CLAMP
    );
  });

  const yBounce = useSharedValue(0);

  const rInputBarAnimatedStyle = useAnimatedStyle(() => {
    const keyboardHeight = rKeyboardHeight.get();
    const translateEnd = -(keyboardHeight - bottomInset + 10);
    const translateY = rReveal.get() * translateEnd;
    return { transform: [{ translateY }] };
  }, [bottomInset]);

  const penInitialWidth = useSharedValue(0);
  const baseRowHeight = useSharedValue(0);
  const hiddenRowHeight = useSharedValue(0);

  const rPenBtnAnimatedStyle = useAnimatedStyle(() => {
    const s = rKeyboardRatio.get();
    const isShowing = keyboardIsShowing.get() === 1;
    const restoreAt = 0.2;
    const targetX = 220;

    const slide = isShowing ? s : interpolate(s, [0, restoreAt, 1], [0, 1, 1], Extrapolation.CLAMP);

    const widthFactor = isShowing
      ? 1 - s
      : interpolate(s, [0, restoreAt, 1], [1, 1, 0], Extrapolation.CLAMP);

    const translateX = slide * targetX;
    const baseWidth = penInitialWidth.get() || 56;
    const width = Math.max(0, baseWidth * widthFactor);
    const marginLeft = 8 * widthFactor;
    return { width, marginLeft, transform: [{ translateX }] };
  }, []);

  const rInputContainerStyle = useAnimatedStyle(() => {
    const reveal = rReveal.get();
    const spacing = 24;
    const base = baseRowHeight.get() || 62;
    const extra = (hiddenRowHeight.get() || 0) + spacing;
    const height = Math.max(0, base + reveal * extra);

    return { height, transform: [{ translateY: yBounce.get() }] };
  }, []);

  useAnimatedReaction(
    () => rReveal.get(),
    (current, prev) => {
      if (prev != null && prev > 0.01 && current <= 0.01) {
        yBounce.set(0);
        yBounce.set(
          withSequence(
            withTiming(5, { duration: 60 }),
            withSpring(0, { stiffness: 900, damping: 120 })
          )
        );
      }
    }
  );

  const rMicFloatingStyle = useAnimatedStyle(() => {
    const reveal = rReveal.get();
    const spacing = 24;
    const translateY = reveal * ((hiddenRowHeight.get() || 0) + spacing);
    return {
      transform: [{ translateY }],
    };
  }, []);

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
              className="text-neutral-500 text-lg font-medium"
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
