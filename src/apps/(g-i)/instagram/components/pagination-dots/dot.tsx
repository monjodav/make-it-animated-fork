import React, { type FC } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export const _numberOfVisibleDots = 7;
export const _dotSize = 6;
const _gap = 4;
export const _dotContainerWidth = _dotSize + _gap;

type Props = {
  index: number;
  listOffsetX: SharedValue<number>;
  isActive: boolean;
  totalImages: number;
  defaultDotColor: string;
  activeDotColor: string;
};

export const Dot: FC<Props> = ({
  index,
  listOffsetX,
  defaultDotColor,
  isActive,
  totalImages,
  activeDotColor,
}) => {
  const rDotStyle = useAnimatedStyle(() => {
    const hideDot =
      index === 0 || index === 1 || index === totalImages + 2 || index === totalImages + 3;

    const scale = interpolate(
      _dotContainerWidth * index - listOffsetX.value,
      [
        0,
        _dotContainerWidth,
        _dotContainerWidth * 2,
        _dotContainerWidth * 3,
        _dotContainerWidth * 4,
        _dotContainerWidth * 5,
        _dotContainerWidth * 6,
      ],
      [0.3, 0.7, 1, 1, 1, 0.7, 0.3],
      Extrapolation.CLAMP
    );

    return {
      opacity: hideDot ? 0 : 1,
      transform: [
        {
          scale,
        },
      ],
    };
  });

  return (
    <View className="items-center justify-center" style={styles.dotContainer}>
      <Animated.View
        style={[
          styles.dot,
          rDotStyle,
          { backgroundColor: isActive ? activeDotColor : defaultDotColor },
        ]}
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
