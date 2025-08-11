import React from "react";
import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTabsStore } from "../../../lib/store/tabs";
import { TabName } from "../../../lib/types";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// google-chrome-footer-animation 🔽

// Make Pressable animatable so opacity/pointerEvents can be driven on the UI thread.
// See Reanimated createAnimatedComponent docs for rationale.
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const EditButton = () => {
  const focusedTabName = useTabsStore.use.focusedTabName();

  // Show Edit only on tab screens (Main/Incognito). Hidden on Groups/others.
  // WHY: Mirrors Chrome's footer controls availability and prevents accidental taps when hidden.
  const rContainerStyle = useAnimatedStyle(() => {
    if (focusedTabName === TabName.Main) {
      return {
        opacity: 1,
        pointerEvents: "auto",
      };
    }

    if (focusedTabName === TabName.Incognito) {
      return {
        opacity: 1,
        pointerEvents: "auto",
      };
    }

    return {
      opacity: 0,
      pointerEvents: "none",
    };
  });

  return (
    <AnimatedPressable style={rContainerStyle} onPress={simulatePress}>
      <Text className="text-lg font-medium text-stone-200">Edit</Text>
    </AnimatedPressable>
  );
};

// google-chrome-footer-animation 🔼
