import React, { FC, PropsWithChildren } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { WheelDirection } from "../../lib/types/daily-steps";
import { SPRING_CONFIG, SPRING_CONFIG_WITH_OVERSHOOT } from "../../lib/constants/daily-steps";

// daily-steps-counter-animation 🔽

const ANGLE = 30;

type Props = {
  index: number;
  previousIndex: SharedValue<number>;
  currentIndex: SharedValue<number>;
  wheelDirection: SharedValue<WheelDirection>;
  fontSize: number;
  digitWidth: number;
};

export const TranslateContainer: FC<PropsWithChildren<Props>> = ({
  children,
  index,
  currentIndex,
  previousIndex,
  wheelDirection,
  fontSize,
  digitWidth,
}) => {
  const translateDistance = fontSize / 1.75;

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
        return withSequence(
          withTiming(360 - ANGLE, { duration: 0 }),
          withSpring(360, SPRING_CONFIG),
        );
      }

      if (wheelDirection.get() === "decrease") {
        return withSequence(withTiming(ANGLE, { duration: 0 }), withSpring(0, SPRING_CONFIG));
      }
    }

    if (isPreviousDigit) {
      if (wheelDirection.get() === "increase") {
        return withSequence(withTiming(0, { duration: 0 }), withSpring(ANGLE, SPRING_CONFIG));
      }

      if (wheelDirection.get() === "decrease") {
        return withSequence(
          withTiming(360, { duration: 0 }),
          withSpring(360 - ANGLE, SPRING_CONFIG),
        );
      }
    }

    return 0;
  });

  const rTranslateYContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.get(),
      transform: [
        {
          perspective: 500,
        },
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
      className="absolute"
      style={[rTranslateYContainerStyle, { height: fontSize, width: digitWidth }]}
    >
      {children}
    </Animated.View>
  );
};

// daily-steps-counter-animation 🔼
