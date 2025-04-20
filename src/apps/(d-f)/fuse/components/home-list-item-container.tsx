import { BlurView } from "expo-blur";
import React, { FC, PropsWithChildren } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedProps,
  Extrapolation,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// fuse-home-tabs-transition-animation 🔽

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const _translateXGap = 20;
const _translateYGap = 5;

type Props = {
  index: number;
  activeTabIndex: SharedValue<number>;
  prevActiveTabIndex: SharedValue<number>;
  horizontalListOffsetX: SharedValue<number>;
  isHorizontalListScrollingX: SharedValue<boolean>;
};

export const HomeListItemContainer: FC<PropsWithChildren<Props>> = ({
  children,
  index,
  activeTabIndex,
  prevActiveTabIndex,
  horizontalListOffsetX,
  isHorizontalListScrollingX,
}) => {
  const { width } = useWindowDimensions();

  const rContainerStyle = useAnimatedStyle(() => {
    if (
      Math.abs(activeTabIndex.value - prevActiveTabIndex.value) > 1 &&
      index !== activeTabIndex.value &&
      !isHorizontalListScrollingX.value
    ) {
      return { opacity: 0 };
    }

    const progress = horizontalListOffsetX.value / width;

    const fadeOut = interpolate(progress, [index, index + 0.7], [1, 0], Extrapolation.CLAMP);
    const fadeIn = interpolate(progress, [index - 0.3, index], [0, 1], Extrapolation.CLAMP);

    const translateXOut = interpolate(
      progress,
      [index, index + 0.7],
      [0, width * 0.7 - _translateXGap],
      Extrapolation.CLAMP
    );
    const translateXIn = interpolate(
      progress,
      [index - 0.3, index],
      [-width * 0.3 + _translateXGap, 0],
      Extrapolation.CLAMP
    );

    const translateYOut = interpolate(
      progress,
      [index, index + 0.7],
      [0, -_translateYGap],
      Extrapolation.CLAMP
    );
    const translateYIn = interpolate(
      progress,
      [index - 0.3, index],
      [-_translateYGap, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity: fadeOut * fadeIn,
      transform: [
        {
          translateX: translateXOut + translateXIn,
        },
        {
          translateY: translateYOut + translateYIn,
        },
      ],
    };
  });

  const blurAnimatedProps = useAnimatedProps(() => {
    const intensity = interpolate(
      horizontalListOffsetX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [75, 0, 75],
      Extrapolation.CLAMP
    );

    return {
      intensity,
    };
  });

  return (
    <Animated.View style={[{ width }, rContainerStyle]} className="bg-neutral-200">
      {children}
      <AnimatedBlurView
        tint="light"
        style={[StyleSheet.absoluteFill, styles.container]}
        animatedProps={blurAnimatedProps}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    pointerEvents: "none",
  },
});

// fuse-home-tabs-transition-animation 🔼
