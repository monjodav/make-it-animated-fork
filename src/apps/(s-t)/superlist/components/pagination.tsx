import { FC } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type PaginationProps = {
  activeIndex: SharedValue<number>;
  slides: Array<{ bgColor: string }>;
};

const PaginationDash: FC<{
  index: number;
  activeIndex: SharedValue<number>;
  inactiveWidth: number;
  activeWidth: number;
  totalSlides: number;
}> = ({ index, activeIndex, inactiveWidth, activeWidth, totalSlides }) => {
  const rDashStyle = useAnimatedStyle(() => {
    const adjustedIndex = activeIndex.value - 1;
    // Normal interpolation for the current dash
    let width = interpolate(
      adjustedIndex,
      [index - 1, index, index + 1],
      [inactiveWidth, activeWidth, inactiveWidth],
      Extrapolation.CLAMP
    );

    let opacity = interpolate(
      adjustedIndex,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    // Handle looping from last to first (scrolling right on last slide)
    if (index === 0) {
      const loopFromLastWidth = interpolate(
        adjustedIndex,
        [totalSlides - 1, totalSlides],
        [inactiveWidth, activeWidth],
        Extrapolation.CLAMP
      );
      const loopFromLastOpacity = interpolate(
        adjustedIndex,
        [totalSlides - 1, totalSlides],
        [0.3, 1],
        Extrapolation.CLAMP
      );
      width = Math.max(width, loopFromLastWidth);
      opacity = Math.max(opacity, loopFromLastOpacity);
    }

    if (index === totalSlides - 1) {
      const loopToFirstWidth = interpolate(
        adjustedIndex,
        [totalSlides - 1, totalSlides],
        [activeWidth, inactiveWidth],
        Extrapolation.CLAMP
      );
      const loopToFirstOpacity = interpolate(
        adjustedIndex,
        [totalSlides - 1, totalSlides],
        [1, 0.3],
        Extrapolation.CLAMP
      );
      width = adjustedIndex >= totalSlides - 1 ? loopToFirstWidth : width;
      opacity = adjustedIndex >= totalSlides - 1 ? loopToFirstOpacity : opacity;
    }

    // Handle looping from first to last (scrolling left on first slide)
    if (index === 0) {
      const loopToLastWidth = interpolate(
        adjustedIndex,
        [-1, 0],
        [inactiveWidth, activeWidth],
        Extrapolation.CLAMP
      );
      const loopToLastOpacity = interpolate(adjustedIndex, [-1, 0], [0.3, 1], Extrapolation.CLAMP);
      if (adjustedIndex < 0) {
        width = loopToLastWidth;
        opacity = loopToLastOpacity;
      }
    }

    if (index === totalSlides - 1) {
      const loopFromFirstWidth = interpolate(
        adjustedIndex,
        [-1, 0],
        [activeWidth, inactiveWidth],
        Extrapolation.CLAMP
      );
      const loopFromFirstOpacity = interpolate(
        adjustedIndex,
        [-1, 0],
        [1, 0.3],
        Extrapolation.CLAMP
      );
      width = adjustedIndex < 0 ? loopFromFirstWidth : width;
      opacity = adjustedIndex < 0 ? loopFromFirstOpacity : opacity;
    }

    return {
      width,
      opacity,
    };
  }, [activeIndex, index, totalSlides]);

  return <Animated.View className="h-[3px] rounded-sm bg-white" style={rDashStyle} />;
};

const Pagination: FC<PaginationProps> = ({ activeIndex, slides }) => {
  const { width: screenWidth } = useWindowDimensions();

  const CONTAINER_PADDING = 140;
  const GAP_WIDTH = 4;

  const availableWidth = screenWidth - CONTAINER_PADDING;
  const totalGaps = (slides.length - 1) * GAP_WIDTH;

  const totalUnits = slides.length + 2;
  const unitWidth = (availableWidth - totalGaps) / totalUnits;
  const inactiveWidth = unitWidth;
  const activeWidth = unitWidth * 3;

  return (
    <View className="flex-row items-center justify-center py-4 px-20" style={{ gap: GAP_WIDTH }}>
      {slides.map((_, index) => (
        <PaginationDash
          key={index}
          index={index}
          activeIndex={activeIndex}
          inactiveWidth={inactiveWidth}
          activeWidth={activeWidth}
          totalSlides={slides.length}
        />
      ))}
    </View>
  );
};

export default Pagination;
