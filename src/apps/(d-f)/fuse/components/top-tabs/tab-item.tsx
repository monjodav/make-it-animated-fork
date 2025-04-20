import React, { FC } from "react";
import { LayoutChangeEvent, Pressable, useWindowDimensions } from "react-native";
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from "react-native-reanimated";

// fuse-home-tabs-transition-animation 🔽

const _defaultColor = "#a3a3a3";
const _activeColor = "#171717";

export type TabItemProps = {
  index: number;
  label: string;
  horizontalListOffsetX: SharedValue<number>;
  onPressIn: () => void;
  onPressOut: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export const TabItem: FC<TabItemProps> = ({
  index,
  label,
  horizontalListOffsetX,
  onPressIn,
  onPressOut,
  onLayout,
}) => {
  const { width } = useWindowDimensions();

  const rTextStyle = useAnimatedStyle(() => {
    const progress = horizontalListOffsetX.value / width;

    return {
      color: interpolateColor(
        progress,
        [index - 1, index, index + 1],
        [_defaultColor, _activeColor, _defaultColor]
      ),
    };
  });

  return (
    <Pressable
      className="py-2 px-1"
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onLayout={onLayout}
    >
      <Animated.Text style={rTextStyle} className="font-bold text-lg">
        {label}
      </Animated.Text>
    </Pressable>
  );
};

// fuse-home-tabs-transition-animation 🔼
