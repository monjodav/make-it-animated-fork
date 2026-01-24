import React, { FC, PropsWithChildren } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
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

const MIN_SCALE = 0.25;

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
  const rScaleStyle = useAnimatedStyle(() => {
    if (currentIndex.get() === index) {
      return {
        transform: [
          {
            scale: withSequence(
              withTiming(MIN_SCALE, { duration: 0 }),
              withSpring(1, SPRING_CONFIG),
            ),
          },
        ],
      };
    }

    if (previousIndex.get() === index) {
      return {
        transform: [{ scale: withSpring(MIN_SCALE, SPRING_CONFIG) }],
      };
    }

    return {
      transform: [{ scale: MIN_SCALE }],
    };
  });

  return (
    <Animated.View className="flex-1" style={rScaleStyle}>
      {children}
    </Animated.View>
  );
};
