import React, { FC, PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";

export const ChannelContainer: FC<PropsWithChildren> = ({ children }) => {
  const { panX, panY, panDistance } = useChannelAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    const rotate = interpolate(panX.value, [0, panDistance], [0, -5]);

    return {
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
      ],
    };
  });

  return (
    <Animated.View
      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-3xl z-50 shadow-lg overflow-hidden"
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
