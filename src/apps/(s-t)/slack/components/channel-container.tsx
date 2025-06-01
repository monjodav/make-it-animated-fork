import React, { FC, memo, PropsWithChildren } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useUnreadAnimation } from "../lib/provider/unread-animation";
import { useHeaderControlsAnimation } from "../lib/hooks/use-header-controls-animation";
import { useFooterControlsAnimation } from "../lib/hooks/use-footer-controls-animation";

type Props = {
  index: number;
};

const ChannelContainer: FC<PropsWithChildren<Props>> = ({ children, index }) => {
  const { width, height } = useWindowDimensions();

  const { animatedChannelIndex, currentChannelIndex } = useUnreadAnimation();
  const { panX, panY, absoluteYAnchor, panDistance } = useChannelAnimation();

  useHeaderControlsAnimation(index);
  useFooterControlsAnimation(index);

  const rContainerStyle = useAnimatedStyle(() => {
    const isLast = index === currentChannelIndex.get();
    const isSecondLast = index === currentChannelIndex.get() - 1;
    const isThirdLast = index === currentChannelIndex.get() - 2;
    const isNextToLast = index === currentChannelIndex.get() + 1;

    const inputRange = [index - 2, index - 1, index, index + 1, index + 2];

    const sign = absoluteYAnchor.get() > height / 2 ? -1 : 1;

    const top = interpolate(
      animatedChannelIndex.get(),
      inputRange,
      [0, 0, 0, width * 0.07, width * 0.01],
      Extrapolation.CLAMP
    );

    const rotate = interpolate(panX.get(), [0, panDistance], [0, sign * 4]);

    const scale = interpolate(
      animatedChannelIndex.get(),
      inputRange,
      [1, 1, 1, 0.95, 0.95],
      Extrapolation.CLAMP
    );

    return {
      top,
      opacity: isLast || isSecondLast || isThirdLast || isNextToLast ? 1 : 0,
      transform: [
        {
          translateX: panX.get(),
        },
        {
          translateY: panY.get(),
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

export default memo(ChannelContainer);
