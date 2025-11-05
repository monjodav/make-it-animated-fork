import React, { FC, PropsWithChildren, use } from "react";
import Animated, { Extrapolation } from "react-native-reanimated";
import { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { AnimatedIndexContext } from "../lib/animated-index-context";

type Props = {
  index: number;
};

export const SlideContainer: FC<PropsWithChildren<Props>> = ({ children, index }) => {
  const { activeIndex } = use(AnimatedIndexContext);

  const rContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      activeIndex.get(),
      [index - 0.5, index, index + 0.5],
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View className="flex-1" style={rContainerStyle}>
      {children}
    </Animated.View>
  );
};
