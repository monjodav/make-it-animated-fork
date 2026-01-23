import { FC } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  Extrapolation,
  useSharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";

interface DotProps {
  index: number;
  activeIndex: SharedValue<number>;
}

const Dot: FC<DotProps> = ({ index, activeIndex }) => {
  const leftRightDirection = useSharedValue("ltr");

  useAnimatedReaction(
    () => activeIndex.get(),
    (current, previous) => {
      if (previous === null) return;
      if (current > previous) {
        leftRightDirection.set("ltr");
      } else if (current < previous) {
        leftRightDirection.set("rtl");
      }
    }
  );
  const animatedStyle = useAnimatedStyle(() => {
    const progress = activeIndex.get();

    const width = interpolate(
      progress,
      leftRightDirection.get() === "ltr"
        ? [index - 1, index - 0.3, index, index + 0.7, index + 1]
        : [index - 1, index - 0.7, index, index + 0.3, index + 1],
      leftRightDirection.get() === "ltr" ? [4, 4, 22, 22, 4] : [4, 22, 22, 4, 4],
      Extrapolation.CLAMP
    );

    const backgroundColor = interpolateColor(
      progress,
      leftRightDirection.get() === "ltr"
        ? [index - 1, index - 0.3, index, index + 0.7, index + 1]
        : [index - 1, index - 0.7, index, index + 0.3, index + 1],
      leftRightDirection.get() === "ltr"
        ? ["#6f6f6f", "#6f6f6f", "#ffffff", "#ffffff", "#6f6f6f"]
        : ["#6f6f6f", "#ffffff", "#ffffff", "#6f6f6f", "#6f6f6f"]
    );

    return {
      width,
      backgroundColor,
    };
  });

  return <Animated.View className="rounded-full h-[4px]" style={animatedStyle} />;
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