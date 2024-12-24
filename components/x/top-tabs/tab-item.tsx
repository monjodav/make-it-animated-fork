import { _homePostsListWidth } from "@/app/x/(tabs)/home";
import React, { FC } from "react";
import { LayoutChangeEvent, Pressable } from "react-native";
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from "react-native-reanimated";

// x-top-tabs-indicator-animation 🔽

const _defaultColor = "#737373";
const _activeColor = "#e5e5e5";

export type TabItemProps = {
  label: string;
  horizontalListOffsetX: SharedValue<number>;
  index: number;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export const TabItem: FC<TabItemProps> = ({
  label,
  horizontalListOffsetX,
  index,
  onPress,
  onLayout,
}) => {
  const rTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        horizontalListOffsetX.value / _homePostsListWidth,
        [index - 1, index, index + 1],
        [_defaultColor, _activeColor, _defaultColor]
      ),
    };
  });

  return (
    <Pressable className="py-4 px-1" onLayout={onLayout} onPress={onPress}>
      <Animated.Text style={rTextStyle} className="font-bold text-base">
        {label}
      </Animated.Text>
    </Pressable>
  );
};

// x-top-tabs-indicator-animation 🔼
