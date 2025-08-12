import { View, useWindowDimensions } from "react-native";
import React from "react";
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from "react-native-reanimated";
import { SharedValue } from "react-native-reanimated";

// fuse-info-cards-carousel-animation 🔽

type DotProps = {
  index: number;
  scrollOffsetX: SharedValue<number>;
};

const Dot: React.FC<DotProps> = ({ scrollOffsetX, index }) => {
  // Card width defines page step; keeps dot logic responsive to orientation/size changes
  const { width: cardWidth } = useWindowDimensions();

  const dotStyle = useAnimatedStyle(() => {
    // Interpolate around the current page center: prev → current → next
    // Using absolute offsets (index * width) keeps math simple with pagingEnabled
    const inputRange = [(index - 1) * cardWidth, index * cardWidth, (index + 1) * cardWidth];

    // Opacity focus ring: 25% when adjacent, 100% when centered
    // Opacity chosen over scale to avoid layout jitter and visual jumpiness
    const opacity = interpolate(
      scrollOffsetX.get(),
      inputRange,
      [0.25, 1, 0.25],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return <Animated.View className="w-[5px] h-[5px] rounded-full bg-neutral-900" style={dotStyle} />;
};

interface PaginationDotsProps {
  numberOfItems: number;
  scrollOffsetX: SharedValue<number>;
}

export const PaginationDots = ({ numberOfItems, scrollOffsetX }: PaginationDotsProps) => {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {/* Each dot subscribes to the same shared scroll value for lockstep updates */}
      {Array.from({ length: numberOfItems }).map((_, index) => {
        return <Dot key={index} scrollOffsetX={scrollOffsetX} index={index} />;
      })}
    </View>
  );
};

// fuse-info-cards-carousel-animation 🔼
