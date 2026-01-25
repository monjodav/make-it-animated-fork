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
import { WheelDirection } from "../../lib/types/daily-steps";
import { SPRING_CONFIG_WITH_OVERSHOOT } from "../../lib/constants/daily-steps";

// daily-steps-counter-animation 🔽

const MIN_SCALE = 0.5;

type Props = {
  index: number;
  currentIndex: SharedValue<number>;
  previousIndex: SharedValue<number>;
  wheelDirection: SharedValue<WheelDirection>;
};

export const ScaleContainer: FC<PropsWithChildren<Props>> = ({
  children,
  index,
  currentIndex,
  previousIndex,
  wheelDirection,
}) => {
  const isCurrentDigit = useDerivedValue(() => {
    return currentIndex.get() === index;
  });

  const isPreviousDigit = useDerivedValue(() => {
    return previousIndex.get() === index;
  });

  const animatedProgress = useDerivedValue(() => {
    if (isCurrentDigit.get()) {
      return withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1, SPRING_CONFIG_WITH_OVERSHOOT),
      );
    }

    if (isPreviousDigit.get()) {
      return withSpring(0, SPRING_CONFIG_WITH_OVERSHOOT);
    }

    return 0;
  });

  const rScaleStyle = useAnimatedStyle(() => {
    if (wheelDirection.get() === "idle") {
      return {
        transform: [
          {
            scale: 1,
          },
          {
            rotateX: "0deg",
          },
        ],
      };
    }

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

// daily-steps-counter-animation 🔼
