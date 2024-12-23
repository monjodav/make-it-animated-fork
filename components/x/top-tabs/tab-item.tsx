import React, { FC } from "react";
import { LayoutChangeEvent, Pressable } from "react-native";
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from "react-native-reanimated";

// x-top-tabs-indicator-animation 🔽

export type TabItemProps = {
  label: string;
  offsetX: SharedValue<number>;
  index: number;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export const TabItem: FC<TabItemProps> = ({ label, offsetX, index, onPress, onLayout }) => {
  const rTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        offsetX.value,
        [index - 1, index, index + 1],
        ["#737373", "#e5e5e5", "#737373"]
      ),
    };
  });

  return (
    <Pressable className="py-3 px-1" onLayout={onLayout} onPress={onPress}>
      <Animated.Text style={rTextStyle} className="font-bold text-base">
        {label}
      </Animated.Text>
    </Pressable>
  );
};

// x-top-tabs-indicator-animation 🔼
