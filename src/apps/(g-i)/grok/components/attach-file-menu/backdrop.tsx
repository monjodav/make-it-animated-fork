import React, { FC } from "react";
import { StyleSheet, Pressable, Platform } from "react-native";
import { useAttachFileMenu } from "../../lib/providers/attach-file-menu";
import Animated, { useAnimatedProps, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { BlurView } from "expo-blur";

// grok-attach-file-menu-animation 🔽

// Animated.createAnimatedComponent enables Reanimated animations on non-animated components
// Required for animating BlurView intensity and Pressable opacity on UI thread
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const Backdrop: FC = () => {
  const { isMenuOpen } = useAttachFileMenu();

  // iOS: Animate blur intensity for native glass morphism effect
  // 75 intensity provides optimal backdrop blur without over-darkening content
  const backdropAnimatedProps = useAnimatedProps(() => {
    if (Platform.OS !== "ios") return { intensity: 0 };
    const intensity = withTiming(isMenuOpen.get() ? 75 : 0); // Default timing for smooth transition
    return {
      intensity,
    };
  });

  // Android: Fallback to opacity animation since BlurView performance varies
  // bg-black/90 provides consistent dark backdrop across Android devices
  const rContainerStyle = useAnimatedStyle(() => {
    if (Platform.OS !== "android") return { opacity: 0 };
    return {
      opacity: withTiming(isMenuOpen.get() ? 1 : 0), // Fade in/out for backdrop
    };
  });

  // Platform-specific rendering: Android uses solid overlay, iOS uses blur
  if (Platform.OS === "android") {
    return (
      <AnimatedPressable
        className="bg-black/90" // 90% opacity provides good contrast without full black
        style={[StyleSheet.absoluteFill, rContainerStyle]}
        onPress={() => isMenuOpen.set(false)} // Tap-to-dismiss functionality
      />
    );
  }

  return (
    // iOS: Pressable wrapper enables tap-to-dismiss while maintaining blur animation
    <Pressable style={StyleSheet.absoluteFill} onPress={() => isMenuOpen.set(false)}>
      <AnimatedBlurView
        tint="dark" // Dark tint complements menu's dark theme
        style={StyleSheet.absoluteFill}
        animatedProps={backdropAnimatedProps} // Animated intensity for smooth blur transition
      />
    </Pressable>
  );
};

// grok-attach-file-menu-animation 🔼
