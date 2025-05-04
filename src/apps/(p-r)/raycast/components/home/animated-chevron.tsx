import React from "react";
import { useHeaderHeight } from "../../lib/hooks/use-header-height";
import { ChevronDown } from "lucide-react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { TRIGGER_DRAG_DISTANCE, useHomeAnimation } from "../../lib/providers/home-animation";
import { View } from "react-native";

// raycast-home-search-transition-animation 🔽

export const AnimatedChevron = () => {
  const { grossHeight } = useHeaderHeight();

  const { offsetY } = useHomeAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        offsetY.value,
        [0, TRIGGER_DRAG_DISTANCE],
        [0, Math.abs(TRIGGER_DRAG_DISTANCE)]
      ),
      opacity: interpolate(offsetY.value, [0, TRIGGER_DRAG_DISTANCE], [0, 1], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      className="absolute left-0 right-0 items-center justify-center pointer-events-none"
      style={[{ top: grossHeight }, rContainerStyle]}
    >
      <View style={{ transform: [{ scaleX: 2 }] }}>
        <ChevronDown size={16} color="#a3a3a3" />
      </View>
    </Animated.View>
  );
};

// raycast-home-search-transition-animation 🔼
