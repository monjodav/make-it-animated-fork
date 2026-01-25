import React, { FC, PropsWithChildren } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { WheelDirection } from "../../lib/types";
import { SPRING_CONFIG, SPRING_CONFIG_WITH_OVERSHOOT } from "../../lib/constants/daily-steps";

const ANGLE = 30;

type Props = {
  index: number;
  previousIndex: SharedValue<number>;
  currentIndex: SharedValue<number>;
  wheelDirection: SharedValue<WheelDirection>;
  fontSize: number;
};

export const TranslateContainer: FC<PropsWithChildren<Props>> = ({
  children,
  index,
  currentIndex,
  previousIndex,
  wheelDirection,
  fontSize,
}) => {
  const translateDistance = fontSize / 1.5;

  const opacity = useDerivedValue(() => {
    const isCurrentDigit = currentIndex.get() === index;
    const isPreviousDigit = previousIndex.get() === index;

    if (isCurrentDigit) {
      return withSpring(1, SPRING_CONFIG_WITH_OVERSHOOT);
    }

    if (isPreviousDigit) {
      return withSpring(0, SPRING_CONFIG_WITH_OVERSHOOT);
    }

    return 0;
  });

  const translateY = useDerivedValue(() => {
    const isCurrentDigit = currentIndex.get() === index;
    const isPreviousDigit = previousIndex.get() === index;

    if (isCurrentDigit) {
      if (wheelDirection.get() === "increase") {
        return withSequence(
          withTiming(translateDistance, { duration: 0 }),
          withSpring(0, SPRING_CONFIG),
        );
      }

      if (wheelDirection.get() === "decrease") {
        return withSequence(
          withTiming(-translateDistance, { duration: 0 }),
          withSpring(0, SPRING_CONFIG),
        );
      }
    }

    if (isPreviousDigit) {
      if (wheelDirection.get() === "increase") {
        return withSpring(-translateDistance, SPRING_CONFIG);
      }

      if (wheelDirection.get() === "decrease") {
        return withSpring(translateDistance, SPRING_CONFIG);
      }
    }

    return wheelDirection.get() === "idle"
      ? withSpring(0, SPRING_CONFIG)
      : wheelDirection.get() === "increase"
        ? translateDistance
        : -translateDistance;
  });

  const angle = useDerivedValue(() => {
    const isCurrentDigit = currentIndex.get() === index;
    const isPreviousDigit = previousIndex.get() === index;

    if (isCurrentDigit) {
      if (wheelDirection.get() === "increase") {
        return withSequence(withTiming(-ANGLE, { duration: 0 }), withSpring(0, SPRING_CONFIG));
      }

      if (wheelDirection.get() === "decrease") {
        return withSequence(withTiming(ANGLE, { duration: 0 }), withSpring(0, SPRING_CONFIG));
      }
    }

    if (isPreviousDigit) {
      if (wheelDirection.get() === "increase") {
        return withSpring(-ANGLE, SPRING_CONFIG);
      }

      if (wheelDirection.get() === "decrease") {
        return withSpring(ANGLE, SPRING_CONFIG);
      }
    }

    return 0;
  });

  const rTranslateYContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.get(),
      transform: [
        {
          translateY: translateY.get(),
        },
        {
          rotateX: `${angle.get()}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View
      className="absolute w-[34px]"
      style={[rTranslateYContainerStyle, { height: fontSize }]}
    >
      {children}
    </Animated.View>
  );
};
