import React, { FC } from "react";
import { LayoutChangeEvent, Pressable, useWindowDimensions } from "react-native";
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from "react-native-reanimated";

// fuse-home-tabs-transition-animation 🔽

// Muted → active → muted colors for a subtle spotlight effect as the page center crosses a tab.
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
  // Width drives the normalization of horizontalListOffsetX into page progress.
  const { width } = useWindowDimensions();

  const rTextStyle = useAnimatedStyle(() => {
    const progress = horizontalListOffsetX.get() / width;

    return {
      // Three-point interpolation: [index-1, index, index+1]
      // Output: default → active → default to highlight only the focused tab.
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
      // onPressIn saves previous index upstream for jump detection; onPressOut drives scroll.
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
