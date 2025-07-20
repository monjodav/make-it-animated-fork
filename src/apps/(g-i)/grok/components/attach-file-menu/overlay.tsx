import React, { FC } from "react";
import { StyleSheet, Platform } from "react-native";
import { useAttachFileMenu } from "../../lib/providers/attach-file-menu";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const Overlay: FC = () => {
  const { isMenuOpen } = useAttachFileMenu();

  const rContainerStyle = useAnimatedStyle(() => {
    if (Platform.OS === "android") return { opacity: 0 };
    return {
      opacity: isMenuOpen.get() ? 1 : withDelay(150, withTiming(0)),
    };
  });

  const overlayAnimatedProps = useAnimatedProps(() => {
    if (Platform.OS === "android") return { intensity: 0 };
    const intensity = withTiming(isMenuOpen.get() ? 0 : 50, { duration: 200 });
    return {
      intensity,
    };
  });

  if (Platform.OS === "android") {
    return <></>;
  }

  return (
    <Animated.View
      className="pointer-events-none"
      style={[StyleSheet.absoluteFill, rContainerStyle]}
    >
      <AnimatedBlurView
        tint="dark"
        style={StyleSheet.absoluteFill}
        animatedProps={overlayAnimatedProps}
      />
    </Animated.View>
  );
};
