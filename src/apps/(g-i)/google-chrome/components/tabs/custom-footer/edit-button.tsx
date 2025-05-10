import React from "react";
import { Pressable, Alert, Text } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTabsStore } from "../../../lib/store/tabs";
import { TabName } from "../../../lib/types";

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
    <AnimatedPressable style={rContainerStyle} onPress={() => Alert.alert("Edit")}>
      <Text className="text-lg font-medium text-stone-200">Edit</Text>
    </AnimatedPressable>
  );
};
