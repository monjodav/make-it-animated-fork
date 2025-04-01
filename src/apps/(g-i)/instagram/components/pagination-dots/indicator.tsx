import React, { type FC } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import type { ScrollType } from ".";
import { _dotContainerWidth, _dotMidRangeScale, _dotSize, _duration } from "./dot";
import { useImageCarousel } from "../../lib/providers/image-carousel-provider";

type Props = {
  indicatorIndex: SharedValue<number>;
  activeDotColor: string;
  scroll?: SharedValue<ScrollType>;
};

export const Indicator: FC<Props> = ({ indicatorIndex, activeDotColor, scroll }) => {
  const { totalImages } = useImageCarousel();

  const centerIndicatorOpacity = useSharedValue(1);

  const leftIndicatorOpacity = useSharedValue(0);
  const leftIndicatorScale = useSharedValue(_dotMidRangeScale);
  const leftIndicatorLeft = useSharedValue(-_dotContainerWidth);

  const rightIndicatorOpacity = useSharedValue(0);
  const rightIndicatorScale = useSharedValue(_dotMidRangeScale);
  const rightIndicatorLeft = useSharedValue(_dotContainerWidth);

  useAnimatedReaction(
    () => scroll?.value,
    (scroll) => {
      if (!scroll) return;

      centerIndicatorOpacity.value = 1;

      leftIndicatorOpacity.value = 0;
      leftIndicatorScale.value = _dotMidRangeScale;
      leftIndicatorLeft.value = -_dotContainerWidth;

      rightIndicatorOpacity.value = 0;
      rightIndicatorScale.value = _dotMidRangeScale;
      rightIndicatorLeft.value = _dotContainerWidth;

      if (indicatorIndex.value === 2 && scroll === "right") {
        centerIndicatorOpacity.value = 0;
        rightIndicatorOpacity.value = 1;
        rightIndicatorLeft.value = withTiming(0, {
          duration: _duration * 0.99,
        });
        rightIndicatorScale.value = withTiming(1, {
          duration: _duration * 0.99,
        });
      }

      if (indicatorIndex.value === 0 && scroll === "left") {
        centerIndicatorOpacity.value = 0;
        leftIndicatorOpacity.value = 1;
        leftIndicatorLeft.value = withTiming(0, { duration: _duration * 0.99 });
        leftIndicatorScale.value = withTiming(1, {
          duration: _duration * 0.99,
        });
      }
    }
  );

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      left: 2 * _dotContainerWidth + indicatorIndex.value * _dotContainerWidth,
    };
  });

  const rLeftIndicatorStyle = useAnimatedStyle(() => {
    return {
      left: leftIndicatorLeft.value,
      transform: [{ scale: leftIndicatorScale.value }],
      opacity: leftIndicatorOpacity.value,
    };
  });

  const rCenterIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: centerIndicatorOpacity.value,
    };
  });

  const rRightIndicatorStyle = useAnimatedStyle(() => {
    return {
      left: rightIndicatorLeft.value,
      transform: [{ scale: rightIndicatorScale.value }],
      opacity: rightIndicatorOpacity.value,
    };
  });

  const rContainer1Style = useAnimatedStyle(() => {
    return {
      left: indicatorIndex.value * _dotContainerWidth,
    };
  });

  if (totalImages > 1 && totalImages < 6) {
    return (
      <Animated.View
        className="absolute items-center justify-center"
        style={[styles.indicatorContainer, rContainer1Style]}
      >
        <View
          className="rounded-full"
          style={[styles.indicator, { backgroundColor: activeDotColor }]}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      className="absolute items-center justify-center"
      style={[styles.indicatorContainer, rContainerStyle]}
    >
      <Animated.View
        className="absolute items-center justify-center"
        style={[styles.indicatorContainer, rLeftIndicatorStyle]}
      >
        <View
          className="rounded-full"
          style={[styles.indicator, { backgroundColor: activeDotColor }]}
        />
      </Animated.View>
      <Animated.View
        className="rounded-full"
        style={[styles.indicator, rCenterIndicatorStyle, { backgroundColor: activeDotColor }]}
      />
      <Animated.View
        className="absolute items-center justify-center"
        style={[styles.indicatorContainer, rRightIndicatorStyle]}
      >
        <View
          className="rounded-full"
          style={[styles.indicator, { backgroundColor: activeDotColor }]}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    width: _dotContainerWidth,
  },
  indicator: {
    width: _dotSize,
    height: _dotSize,
  },
});
