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
  autoScrollProgress?: SharedValue<number>;
};

const PaginationDash: FC<{
  index: number;
  activeIndex: SharedValue<number>;
  inactiveWidth: number;
  activeWidth: number;
  totalSlides: number;
  autoScrollProgress?: SharedValue<number>;
}> = ({ index, activeIndex, inactiveWidth, activeWidth, totalSlides, autoScrollProgress }) => {
  const rDashStyle = useAnimatedStyle(() => {
    const adjustedIndex = activeIndex.get() - 1;
    // Normal interpolation for the current dash
    let width = interpolate(
      adjustedIndex,
      [index - 1, index, index + 1],
      [inactiveWidth, activeWidth, inactiveWidth],
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

      width = Math.max(width, loopFromLastWidth);
    }

    if (index === totalSlides - 1) {
      const loopToFirstWidth = interpolate(
        adjustedIndex,
        [totalSlides - 1, totalSlides],
        [activeWidth, inactiveWidth],
        Extrapolation.CLAMP
      );

      width = adjustedIndex >= totalSlides - 1 ? loopToFirstWidth : width;
    }

    // Handle looping from first to last (scrolling left on first slide)
    if (index === 0) {
      const loopToLastWidth = interpolate(
        adjustedIndex,
        [-1, 0],
        [inactiveWidth, activeWidth],
        Extrapolation.CLAMP
      );

      if (adjustedIndex < 0) {
        width = loopToLastWidth;
      }
    }

    if (index === totalSlides - 1) {
      const loopFromFirstWidth = interpolate(
        adjustedIndex,
        [-1, 0],
        [activeWidth, inactiveWidth],
        Extrapolation.CLAMP
      );

      width = adjustedIndex < 0 ? loopFromFirstWidth : width;
    }

    return {
      width,
    };
  }, [activeIndex, index, totalSlides]);

  const rProgressStyle = useAnimatedStyle(() => {
    if (!autoScrollProgress) return { width: 0 };

    const adjustedIndex = activeIndex.get() - 1;
    const currentSlide = Math.floor(adjustedIndex);

    if (currentSlide !== index) return { width: 0 };

    const progress = autoScrollProgress.get();
    const progressWidth = interpolate(progress, [0, 1], [0, activeWidth], Extrapolation.CLAMP);

    return {
      width: progressWidth,
    };
  }, [activeIndex, autoScrollProgress, index, activeWidth]);

  return (
    <View style={{ position: "relative" }}>
      <Animated.View className="h-[3px] rounded-sm bg-slate-600" style={rDashStyle} />
      {autoScrollProgress && (
        <Animated.View
          className="h-[3px] rounded-sm bg-white absolute top-0 left-0"
          style={rProgressStyle}
        />
      )}
    </View>
  );
};

const Pagination: FC<PaginationProps> = ({ activeIndex, slides, autoScrollProgress }) => {
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
          autoScrollProgress={autoScrollProgress}
        />
      ))}
    </View>
  );
};

export default Pagination;
