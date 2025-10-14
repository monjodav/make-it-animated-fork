import { FC } from "react";
import { View } from "react-native";
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from "react-native-reanimated";

interface DotProps {
  index: number;
  activeIndex: SharedValue<number>;
}

const Dot: FC<DotProps> = ({ index, activeIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        activeIndex.get(),
        [index - 1, index, index + 1],
        ["#6f6f6f", "#ffffff", "#6f6f6f"]
      ),
    };
  });

  return <Animated.View className="size-2 rounded-full" style={animatedStyle} />;
};

interface PaginationDotsProps {
  numberOfDots: number;
  activeIndex: SharedValue<number>;
}

export const PaginationDots: FC<PaginationDotsProps> = ({ numberOfDots, activeIndex }) => {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: numberOfDots }, (_, index) => (
        <Dot key={index} index={index} activeIndex={activeIndex} />
      ))}
    </View>
  );
};
