import { FC, useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type PaginationItemProps = {
  index: number;
  currentSlideIndex: number;
  animatedSlideIndex: SharedValue<number>;
  inactiveWidth: number;
  activeWidth: number;
  totalSlides: number;
  slideDuration: number;
  isDragging: SharedValue<boolean>;
  handleScrollToIndex: (index: number) => void;
  translateY: SharedValue<number>;
  topCarouselOffset: number;
};

export const PaginationItem: FC<PaginationItemProps> = ({
  index,
  currentSlideIndex,
  animatedSlideIndex,
  inactiveWidth,
  activeWidth,
  totalSlides,
  slideDuration,
  isDragging,
  handleScrollToIndex,
  translateY,
  topCarouselOffset,
}) => {
  const slideProgress = useSharedValue(0);

  const barWidth = useDerivedValue(() => {
    const adjustedIndex = animatedSlideIndex.get() - 1;
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

    return width;
  });

  const rBarWidthStyle = useAnimatedStyle(() => {
    return {
      width: barWidth.get(),
    };
  }, []);

  const rBarProgressStyle = useAnimatedStyle(() => {
    if (isDragging.get()) {
      cancelAnimation(slideProgress);
    }

    const progressWidth = interpolate(slideProgress.get(), [0, 1], [0, 100], Extrapolation.CLAMP);

    return {
      width: `${progressWidth}%`,
      opacity: interpolate(barWidth.get(), [0, activeWidth], [0, 1], Extrapolation.CLAMP),
    };
  }, []);

  useEffect(() => {
    if (currentSlideIndex - 1 === index) {
      slideProgress.set(0);
      slideProgress.set(withTiming(1, { duration: slideDuration }));
    } else {
      slideProgress.set(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex]);

  useAnimatedReaction(
    () => ({ isDragging: isDragging.get() }),
    ({ isDragging }) => {
      if (!isDragging && currentSlideIndex - 1 === index && slideProgress.get() > 0) {
        slideProgress.set(0);
        slideProgress.set(withTiming(1, { duration: slideDuration }));
      }
    }
  );

  useAnimatedReaction(
    () => ({ slideProgress: slideProgress.get() }),
    ({ slideProgress }) => {
      if (slideProgress === 1 && currentSlideIndex === totalSlides) {
        isDragging.set(true);
        translateY.set(
          withTiming(-topCarouselOffset, { duration: 200, easing: Easing.inOut(Easing.quad) })
        );
      }
      if (!isDragging.get() && slideProgress === 1) {
        scheduleOnRN(handleScrollToIndex, currentSlideIndex + 1);
      }
    }
  );

  return (
    <Animated.View
      className="h-[2px] rounded-full bg-slate-600 overflow-hidden"
      style={rBarWidthStyle}
    >
      <Animated.View
        className="bg-white absolute top-0 bottom-0 left-0"
        style={rBarProgressStyle}
      />
    </Animated.View>
  );
};
