import React, { FC, PropsWithChildren } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  mass: 1,
  damping: 14,
  stiffness: 220,
  overshootClamping: true,
};

const MIN_SCALE = 0.7;

type Props = {
  index: number;
  currentIndex: SharedValue<number>;
  previousIndex: SharedValue<number>;
};

export const ScaleContainer: FC<PropsWithChildren<Props>> = ({
  children,
  index,
  currentIndex,
  previousIndex,
}) => {
  const animatedProgress = useDerivedValue(() => {
    if (currentIndex.get() === index) {
      return withSequence(withTiming(0, { duration: 0 }), withSpring(1, SPRING_CONFIG));
    }

    if (previousIndex.get() === index) {
      return withSpring(0, SPRING_CONFIG);
    }

    return 0;
  });

  const rScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(animatedProgress.get(), [0, 1], [MIN_SCALE, 1], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <Animated.View className="flex-1" style={rScaleStyle}>
      {children}
    </Animated.View>
  );
};
