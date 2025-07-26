import React, { FC } from "react";
import { View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

interface DotsProps {
  numberOfDots: number;
  activeIndex: SharedValue<number>;
}

export const Dots: FC<DotsProps> = ({ numberOfDots, activeIndex }) => {
  return (
    <View className="flex-row items-center justify-center gap-1">
      {Array.from({ length: numberOfDots }, (_, index) => (
        <Dot key={index} index={index} activeIndex={activeIndex} />
      ))}
    </View>
  );
};

interface DotProps {
  index: number;
  activeIndex: SharedValue<number>;
}

const Dot: FC<DotProps> = ({ index, activeIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = withTiming(activeIndex.get() === index ? "#3C5627" : "#d6d3d1", {
      duration: 200,
    });

    return {
      backgroundColor,
    };
  });

  return <Animated.View className="w-2 h-2 rounded-full" style={animatedStyle} />;
};
