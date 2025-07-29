import React, { FC } from "react";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

// pinterest-navigation-between-boards-animation 🔽

type Props = {
  activeTabIndex: SharedValue<number>; // Fractional tab index (0.0 to tabCount-1)
  tabWidths: SharedValue<number[]>; // Dynamic tab widths from onLayout measurements
  tabOffsets: SharedValue<number[]>; // Calculated left positions for each tab
  tabBarOffsetX: SharedValue<number>; // Horizontal scroll offset for transform compensation
};

export const TabIndicator: FC<Props> = ({
  activeTabIndex,
  tabWidths,
  tabOffsets,
  tabBarOffsetX,
}) => {
  // Worklet-optimized style hook drives smooth indicator positioning and sizing
  const rIndicatorStyle = useAnimatedStyle(() => {
    // Interpolate horizontal position based on fractional tab index
    // Input: activeTabIndex.value (0.0 to tabCount-1, can be fractional during swipe)
    // Output: corresponding left positions from tabOffsets array
    const left = interpolate(
      activeTabIndex.value,
      Object.keys(tabOffsets.value).map(Number), // [0, 1, 2, 3, ...]
      tabOffsets.value // [0px, 120px, 240px, ...] actual tab positions
    );

    // Interpolate indicator width to match active tab width
    // Creates smooth width transitions during tab changes
    const width = interpolate(
      activeTabIndex.value,
      Object.keys(tabWidths.value).map(Number), // [0, 1, 2, 3, ...]
      tabWidths.value // [80px, 120px, 100px, ...] measured tab widths
    );

    return {
      left, // Absolute positioning from left edge
      width, // Dynamic width matching active tab
      transform: [
        {
          // Compensates for tab bar horizontal scroll to maintain fixed indicator position
          translateX: -tabBarOffsetX.value, // Negative offset keeps indicator aligned with tabs
        },
      ],
    };
  });

  return (
    <Animated.View
      className="absolute h-[2.5px] bottom-0 rounded-full bg-neutral-300"
      style={rIndicatorStyle} // Dynamic positioning and sizing from useAnimatedStyle
    />
  );
};

// pinterest-navigation-between-boards-animation 🔼
