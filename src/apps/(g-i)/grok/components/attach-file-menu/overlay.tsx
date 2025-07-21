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

// grok-attach-file-menu-animation 🔽

// Animated.createAnimatedComponent enables blur intensity animation on UI thread
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const Overlay: FC = () => {
  const { isMenuOpen } = useAttachFileMenu();

  // iOS-only overlay opacity with delayed fade-out for smooth menu closing
  const rContainerStyle = useAnimatedStyle(() => {
    if (Platform.OS !== "ios") return { opacity: 0 };
    return {
      // Immediate fade-in, 150ms delayed fade-out allows menu items to animate first
      opacity: isMenuOpen.get() ? withTiming(1) : withDelay(150, withTiming(0)),
    };
  });

  // Reverse blur animation: blur increases when menu closes for depth effect
  const overlayAnimatedProps = useAnimatedProps(() => {
    if (Platform.OS !== "ios") return { intensity: 0 };
    // 0 intensity when open (clear), 50 intensity when closed (blurred background)
    // 200ms duration provides smooth transition without jarring blur changes
    const intensity = withTiming(isMenuOpen.get() ? 0 : 50, { duration: 200 });
    return {
      intensity,
    };
  });

  // Android fallback: no overlay needed since backdrop handles background
  if (Platform.OS !== "ios") {
    return <></>;
  }

  return (
    <Animated.View
      className="pointer-events-none" // Prevents touch interference with menu interactions
      style={[StyleSheet.absoluteFill, rContainerStyle]}
    >
      <AnimatedBlurView
        tint="dark" // Dark tint maintains visual consistency with backdrop
        style={StyleSheet.absoluteFill}
        animatedProps={overlayAnimatedProps} // Animated blur intensity for depth layering
      />
    </Animated.View>
  );
};

// grok-attach-file-menu-animation 🔼
