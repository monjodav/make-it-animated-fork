import React, { FC } from "react";
import { StyleSheet, Pressable, Platform } from "react-native";
import { useAttachFileMenu } from "../../lib/providers/attach-file-menu";
import Animated, { useAnimatedProps, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { BlurView } from "expo-blur";

// grok-attach-file-menu-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const Backdrop: FC = () => {
  const { isMenuOpen } = useAttachFileMenu();

  const backdropAnimatedProps = useAnimatedProps(() => {
    if (Platform.OS !== "ios") return { intensity: 0 };
    const intensity = withTiming(isMenuOpen.get() ? 75 : 0);
    return {
      intensity,
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    if (Platform.OS !== "android") return { opacity: 0 };
    return {
      opacity: withTiming(isMenuOpen.get() ? 1 : 0),
    };
  });

  if (Platform.OS === "android") {
    return (
      <AnimatedPressable
        className="bg-black/90"
        style={[StyleSheet.absoluteFill, rContainerStyle]}
        onPress={() => isMenuOpen.set(false)}
      />
    );
  }

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={() => isMenuOpen.set(false)}>
      <AnimatedBlurView
        tint="dark"
        style={StyleSheet.absoluteFill}
        animatedProps={backdropAnimatedProps}
      />
    </Pressable>
  );
};

// grok-attach-file-menu-animation 🔼
