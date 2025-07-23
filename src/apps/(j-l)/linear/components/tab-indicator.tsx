import React, { FC } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Tab } from "./tab-bar";
import { _borderColor, _borderCurve, _borderRadius } from "./tab-item";

// linear-button-tabs-indicator-animation 🔽

// Animation timing for smooth tab transitions without feeling sluggish
const _duration = 200; // 200ms provides responsive feel while allowing users to see the movement

type Props = {
  activeTab: Tab;
  tabBarOffsetX: SharedValue<number>;
  tabWidths: SharedValue<number[]>;
  tabOffsets: SharedValue<number[]>;
};

export const TabIndicator: FC<Props> = ({ activeTab, tabBarOffsetX, tabWidths, tabOffsets }) => {
  // Animated style hook drives indicator position and size changes on UI thread
  const rIndicatorStyle = useAnimatedStyle(() => {
    // Interpolate activeTab enum value (0,1,2...) to actual left positions in pixels
    // Input: [0, 1, 2, 3, 4, 5] (tab indices) → Output: [0, 120, 240, ...] (pixel positions)
    const left = withTiming(
      interpolate(activeTab, Object.keys(tabOffsets.value).map(Number), tabOffsets.value),
      {
        duration: _duration, // Smooth position transition timing
      }
    );

    // Interpolate activeTab to corresponding tab width for responsive indicator sizing
    // Input: [0, 1, 2, 3, 4, 5] (tab indices) → Output: [80, 120, 100, ...] (pixel widths)
    const width = withTiming(
      interpolate(activeTab, Object.keys(tabWidths.value).map(Number), tabWidths.value),
      {
        duration: _duration, // Synchronized width animation with position
      }
    );

    return {
      left, // Absolute positioning from container left edge
      width, // Dynamic width matching active tab
      transform: [{ translateX: -tabBarOffsetX.value }], // Compensates for horizontal scroll offset
    };
  });

  // Absolute positioning allows indicator to slide behind tabs without affecting layout
  return <Animated.View className="absolute h-full" style={[rIndicatorStyle, styles.container]} />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: _borderColor, // Matches tab border color for visual cohesion
    borderRadius: _borderRadius, // Consistent corner radius with tab items
    borderCurve: _borderCurve, // iOS 16+ continuous curves for softer appearance
  },
});

// linear-button-tabs-indicator-animation 🔼
