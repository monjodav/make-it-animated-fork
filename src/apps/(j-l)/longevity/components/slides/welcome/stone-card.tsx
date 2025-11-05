import React, { FC, use } from "react";
import { useWindowDimensions, View, StyleSheet } from "react-native";
import { AnimatedIndexContext } from "../../../routes/onboarding";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
} from "react-native-reanimated";
import { BASE_SPRING_CONFIG } from "../../../lib/constants";

export const StoneCard: FC = () => {
  const { width: screenWidth } = useWindowDimensions();

  const { activeIndex } = use(AnimatedIndexContext);

  const rContainerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      activeIndex.get(),
      [0, 1],
      [0, -screenWidth],
      Extrapolation.CLAMP
    );
    const rotate = interpolate(activeIndex.get(), [0, 0.5], [8, 0], Extrapolation.CLAMP);
    const scale = interpolate(activeIndex.get(), [0, 0.5], [1, 0.97], Extrapolation.CLAMP);

    return {
      transform: [
        { translateX: withSpring(translateX, BASE_SPRING_CONFIG) },
        { rotate: withSpring(`${rotate}deg`, BASE_SPRING_CONFIG) },
        { scale: withSpring(scale, BASE_SPRING_CONFIG) },
      ],
    };
  });

  return (
    <Animated.View
      style={[rContainerStyle, styles.borderCurve]}
      className="absolute top-[22%] left-[63%] w-[38%] aspect-[1/1.2] rounded-3xl items-center justify-center gap-10 bg-stone-300"
    >
      <View className="size-20 rounded-full bg-stone-400" />
      <View className="h-5 w-20 rounded-full bg-neutral-200" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
