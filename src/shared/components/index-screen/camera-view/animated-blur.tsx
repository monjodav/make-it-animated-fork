import React, { FC } from "react";
import Animated, { useAnimatedProps, useSharedValue, withSpring } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import { useIndexAnimation } from "../../../lib/providers/index-animation";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const AnimatedBlur: FC = () => {
  const { state } = useIndexAnimation();

  const blurIntensity = useSharedValue(75);

  const backdropAnimatedProps = useAnimatedProps(() => {
    if (state.get() === 1) {
      blurIntensity.set(withSpring(0));
    } else {
      blurIntensity.set(withSpring(75));
    }

    return { intensity: blurIntensity.value };
  });

  if (Platform.OS === "android") {
    return <></>;
  }

  return (
    <AnimatedBlurView
      style={StyleSheet.absoluteFill}
      tint="dark"
      animatedProps={backdropAnimatedProps}
    />
  );
};
