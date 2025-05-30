import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useUnreadAnimation } from "../lib/provider/unread-animation";

type Props = {
  index: number;
};

export const ChannelContainer: FC<PropsWithChildren<Props>> = ({ children, index }) => {
  const { width, height } = useWindowDimensions();

  const { currentChannelIndex, prevChannelIndex } = useUnreadAnimation();
  const { panX, panY, absoluteYAnchor, panDistance } = useChannelAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    const isLast = index === prevChannelIndex.value;
    const isSecondLast = index === prevChannelIndex.value - 1;
    const isThirdLast = index === prevChannelIndex.value - 2;
    const isNextToLast = index === prevChannelIndex.value + 1;

    const inputRange = [index - 2, index - 1, index, index + 1, index + 2];

    const sign = absoluteYAnchor.value > height / 2 ? -1 : 1;
    const rotate = interpolate(panX.value, [0, panDistance], [0, sign * 4]);

    const top = interpolate(
      currentChannelIndex.value,
      inputRange,
      [0, 0, 0, width * 0.07, width * 0.01],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      currentChannelIndex.value,
      inputRange,
      [1, 1, 1, 0.95, 0.95],
      Extrapolation.CLAMP
    );

    return {
      top,
      opacity: isLast || isSecondLast || isThirdLast || isNextToLast ? 1 : 0,
      transform: [
        {
          translateX: panX.value,
        },
        {
          translateY: panY.value,
        },
        {
          rotate: `${rotate}deg`,
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
