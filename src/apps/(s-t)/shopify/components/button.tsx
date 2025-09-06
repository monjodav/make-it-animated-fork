import { Pressable } from "react-native";
import React from "react";
import Animated, { interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { X } from "lucide-react-native";
import { useMenu } from "../lib/providers/menu-provider";

// shopify-menu-transition-animation 🔽

export const Button = () => {
  const { menuProgress } = useMenu();

  // rButtonStyle: drives the button's entrance/exit animation
  // Uses interpolation + timing for smooth fade, position, and rotation
  const rButtonStyle = useAnimatedStyle(() => {
    // Opacity tied to menu progress (hidden at 0 → visible at 1)
    // withTiming ensures fade is smooth and consistent (300ms chosen for balance between responsiveness and smoothness)
    const opacity = withTiming(interpolate(menuProgress.get(), [0, 1], [0, 1]), { duration: 300 });

    // Horizontal shift: keeps button from snapping into place
    // Moves from farther right (70) → closer to edge (30) as menu opens
    const right = withTiming(interpolate(menuProgress.get(), [0, 1], [70, 30]), {
      duration: 300,
    });

    return {
      right,
      opacity,
      transform: [
        // Rotation signals state change (menu open/close)
        // 45deg = closed, 90deg = open → matches UX convention of "X" morph
        { rotate: withTiming(menuProgress.get() === 1 ? "90deg" : "45deg", { duration: 300 }) },
      ],
      pointerEvents: menuProgress.get() === 1 ? "auto" : "none", // Disable interactions when closed
    };
  });

  return (
    <Animated.View
      className="absolute bottom-5"
      style={rButtonStyle} // Animated container handles opacity, position, rotation
    >
      {/* Pressable button itself stays static; animation handled at container level */}
      <Pressable className="p-9 rounded-full bg-neutral-700" onPress={() => menuProgress.set(0)}>
        <X size={20} color="#E5E7EB" />
      </Pressable>
    </Animated.View>
  );
};

// shopify-menu-transition-animation 🔼
