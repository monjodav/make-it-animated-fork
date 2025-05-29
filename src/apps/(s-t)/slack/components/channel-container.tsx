import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";

type Props = {
  index: number;
  total: number;
};

export const ChannelContainer: FC<PropsWithChildren<Props>> = ({ children, index, total }) => {
  const { width, height } = useWindowDimensions();

  const { activeChannelIndex, panX, panY, absoluteYAnchor, panDistance } = useChannelAnimation();

  const isLast = index === total - 1;
  const isSecondLast = index === total - 2;
  const isThirdLast = index === total - 3;

  const rContainerStyle = useAnimatedStyle(() => {
    const inputRange = [index - 2, index - 1, index, index + 1, index + 2];

    const sign = absoluteYAnchor.value > height / 2 ? -1 : 1;
    const rotate = interpolate(panX.value, [0, panDistance], [0, sign * 4]);

    const top = interpolate(
      activeChannelIndex.value,
      inputRange,
      [0, 0, 0, width * 0.07, width * 0.01],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      activeChannelIndex.value,
      inputRange,
      [1, 1, 1, 0.95, 0.95],
      Extrapolation.CLAMP
    );

    return {
      top,
      opacity: isLast || isSecondLast || isThirdLast ? 1 : 0,
      transform: [
        {
          translateX: isLast ? panX.value : 0,
        },
        {
          translateY: isLast ? panY.value : 0,
        },
        {
          rotate: isLast ? `${rotate}deg` : `${0}deg`,
        },
        {
          scale,
        },
      ],
    };
  });

  return (
    <Animated.View
      key={index}
      className="absolute w-full h-full bg-neutral-900 border border-neutral-800 rounded-3xl z-50 shadow-lg overflow-hidden"
      style={[styles.container, rContainerStyle]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
});
