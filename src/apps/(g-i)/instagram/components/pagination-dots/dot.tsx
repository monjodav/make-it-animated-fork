import React, { memo, type FC } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { ScrollType } from ".";
import { cn } from "@/src/shared/lib/utils/cn";
import { useImageCarousel } from "../../lib/providers/image-carousel-provider";

export const _numberOfDots = 9;
export const _dotSize = 6;
const _gap = 4;
export const _dotContainerWidth = _dotSize + _gap;
const _allDotsWidth = _dotContainerWidth * _numberOfDots;
export const _visibleDotsWidth = _allDotsWidth - 2 * _dotContainerWidth;

const _dotScales = [0.001, 0.41, 0.71, 1.01, 1.02, 1.03, 0.72, 0.42, 0.002];
export const _dotMidRangeScale = 0.7;

export const _duration = 250;

type Props = {
  index: number;
  defaultDotColor: string;
  scroll?: SharedValue<ScrollType>;
};

const Dot: FC<Props> = ({ index, scroll, defaultDotColor }) => {
  const { totalImages } = useImageCarousel();

  const left = useSharedValue(index * _dotContainerWidth - _dotContainerWidth);
  const scale = useSharedValue(_dotScales[index]);

  useAnimatedReaction(
    () => scroll?.value,
    (scroll) => {
      if (!scroll) return;
      const currentScaleIndex = _dotScales.findIndex((scaleValue) => scaleValue === scale.value);

      if (scroll === "right") {
        if (currentScaleIndex === 0) {
          scale.value = _dotScales[_numberOfDots - 1];
        } else {
          scale.value = withTiming(_dotScales[currentScaleIndex - 1], {
            duration: _duration,
          });
        }

        left.value -= _dotContainerWidth;
      }
      if (scroll === "left") {
        if (currentScaleIndex === _dotScales.length - 1) {
          scale.value = _dotScales[0];
        } else {
          scale.value = withTiming(_dotScales[currentScaleIndex + 1], {
            duration: _duration,
          });
        }

        left.value += _dotContainerWidth;
      }
    }
  );

  const rDotStyle = useAnimatedStyle(() => {
    if (left.value < -_dotContainerWidth) {
      left.value = _visibleDotsWidth;
    }

    if (left.value > _visibleDotsWidth) {
      left.value = -_dotContainerWidth;
    }

    return {
      left: withTiming(left.value, { duration: _duration }),
      transform: [{ scale: scale.value }],
    };
  });

  if (totalImages > 1 && totalImages < 6) {
    return (
      <View className="items-center justify-center" style={styles.dotContainer}>
        <View style={[styles.dot, { backgroundColor: defaultDotColor }]} className="rounded-full" />
      </View>
    );
  }

  return (
    <View
      className={cn(
        "absolute items-center justify-center",
        totalImages === 6 && index < 3 && "opacity-0",
        totalImages === 7 && index > 0 && index < 3 && "opacity-0"
      )}
      style={styles.dotContainer}
    >
      <Animated.View
        style={[rDotStyle, styles.dot, { backgroundColor: defaultDotColor }]}
        className="rounded-full"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    width: _dotContainerWidth,
  },
  dot: {
    width: _dotSize,
    height: _dotSize,
  },
});

export default memo(Dot);
