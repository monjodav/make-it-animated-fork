import React, { FC, use } from "react";
import { useWindowDimensions, View, StyleSheet } from "react-native";
import { AnimatedIndexContext } from "../../../lib/animated-index-context";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
} from "react-native-reanimated";
import { BASE_SPRING_CONFIG } from "../../../lib/constants";
import { SlideItemProps } from "../../../lib/types";
export const RedCard: FC<SlideItemProps> = ({ index }) => {
  const { width: screenWidth } = useWindowDimensions();

  const { activeIndex } = use(AnimatedIndexContext);

  const rContainerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      activeIndex.get(),
      [index, index + 1, index + 2],
      [0, screenWidth, screenWidth * 2],
      Extrapolation.CLAMP
    );
    const rotate = interpolate(
      activeIndex.get(),
      [index, index + 1, index + 2],
      [-2, -4, 3],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      activeIndex.get(),
      [index, index + 1, index + 2],
      [1, 0.98, 1.2],
      Extrapolation.CLAMP
    );

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
      className="absolute w-[45%] aspect-[1/1.4] top-0 left-[28%] rounded-3xl items-center justify-center gap-10 bg-red-500"
    >
      <View className="size-20 rounded-3xl bg-amber-500" />
      <View className="h-5 w-20 rounded-full bg-neutral-200/25" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
