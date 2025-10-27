import { FC } from "react";
import { BottomSheetBackdropProps, useBottomSheet } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  Extrapolation,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Pressable } from "react-native";

// perplexity-bottom-sheet-backdrop-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const Backdrop: FC<BottomSheetBackdropProps> = ({ animatedIndex }) => {
  const { close } = useBottomSheet();

  const rPressableStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: animatedIndex.get() >= 0 ? "auto" : "none",
    };
  });

  const animatedIntensity = useAnimatedProps(() => {
    const maxIntensity = 30;

    const intensity = interpolate(
      animatedIndex.get(),
      [-1, 0],
      [0, maxIntensity],
      Extrapolation.CLAMP
    );

    return {
      intensity,
    };
  });

  return (
    <AnimatedPressable className="absolute inset-0" style={rPressableStyle} onPress={() => close()}>
      <AnimatedBlurView
        animatedProps={animatedIntensity}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
    </AnimatedPressable>
  );
};

// perplexity-bottom-sheet-backdrop-animation 🔼
