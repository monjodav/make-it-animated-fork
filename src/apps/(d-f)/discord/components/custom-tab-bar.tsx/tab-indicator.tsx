import React, { FC } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

// discord-top-tabs-indicator-animation 🔽

type Props = {
  indexDecimal: SharedValue<number>; // Shared animated tab index (0.0 to tabCount-1)
  width: number; // Calculated indicator width matching individual tab spacing
};

export const TabIndicator: FC<Props> = ({ indexDecimal, width }) => {
  // Animated style hook - drives the horizontal sliding indicator animation
  const rIndicatorStyle = useAnimatedStyle(() => {
    // Maps tab index to horizontal position: index 0 = 0px, index 1 = width px, etc.
    // Spring animation provides Discord-style bouncy tab switching feel
    const translateX = withSpring(interpolate(indexDecimal.value, [0, 1], [0, width]), {
      stiffness: 180, // Medium-high stiffness for responsive but controlled motion
      damping: 20, // Light damping allows subtle bounce without excessive oscillation
    });

    return {
      width, // Fixed width ensures consistent indicator size across all tab positions
      transform: [{ translateX }], // Horizontal translation drives the sliding indicator effect
    };
  });

  return (
    <Animated.View
      className="absolute rounded-full bg-[#101217] p-[5px]"
      style={[
        rIndicatorStyle,
        {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0, // Absolute positioning fills container height while translateX handles width
          borderCurve: "continuous", // iOS 16+ continuous curves match parent container styling
        },
      ]}
    >
      {/* Inner view creates the actual visual indicator with Discord's signature raised appearance */}
      <View className="bg-[#30323B] w-full h-full rounded-full" />
    </Animated.View>
  );
};

// discord-top-tabs-indicator-animation 🔼
