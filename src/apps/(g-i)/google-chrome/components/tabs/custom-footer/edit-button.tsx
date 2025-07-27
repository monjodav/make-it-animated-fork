import React from "react";
import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTabsStore } from "../../../lib/store/tabs";
import { TabName } from "../../../lib/types";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// google-chrome-footer-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const EditButton = () => {
  const focusedTabName = useTabsStore.use.focusedTabName();

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
