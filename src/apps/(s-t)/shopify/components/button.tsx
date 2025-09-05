import { Pressable } from "react-native";
import React from "react";
import Animated, { interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { X } from "lucide-react-native";
import { useMenu } from "../lib/providers/menu-provider";

// shopify-menu-transition-animation 🔽

export const Button = () => {
  const { menuProgress } = useMenu();

  const rButtonStyle = useAnimatedStyle(() => {
    const opacity = withTiming(interpolate(menuProgress.get(), [0, 1], [0, 1]), { duration: 300 });
    const right = withTiming(interpolate(menuProgress.get(), [0, 1], [70, 30]), {
      duration: 300,
    });

    return {
      right,
      opacity,
      transform: [
        { rotate: withTiming(menuProgress.get() === 1 ? "90deg" : "45deg", { duration: 300 }) },
      ],
    };
  });

  return (
    <Animated.View className="absolute bottom-5" style={rButtonStyle}>
      <Pressable className="p-9 rounded-full bg-neutral-700" onPress={() => menuProgress.set(0)}>
        <X size={20} color="#E5E7EB" />
      </Pressable>
    </Animated.View>
  );
};

// shopify-menu-transition-animation 🔼
