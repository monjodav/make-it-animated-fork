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

const SPRING_CONFIG = {
  mass: 1,
  damping: 14,
  stiffness: 200,
};

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
  const translateDistance = fontSize;

  const isCurrentDigit = useDerivedValue(() => {
    return currentIndex.get() === index;
  });

  const isPreviousDigit = useDerivedValue(() => {
    return previousIndex.get() === index;
  });

  const rTranslateYContainerStyle = useAnimatedStyle(() => {
    if (isCurrentDigit.get()) {
      if (wheelDirection.get() === "increase") {
        return {
          opacity: 1,
          transform: [
            {
              translateY: withSequence(
                withTiming(translateDistance, { duration: 0 }),
                withSpring(0, SPRING_CONFIG),
              ),
            },
          ],
        };
      }

      if (wheelDirection.get() === "decrease") {
        return {
          opacity: 1,
          transform: [
            {
              translateY: withSequence(
                withTiming(-translateDistance, { duration: 0 }),
                withSpring(0, SPRING_CONFIG),
              ),
            },
          ],
        };
      }
    }

    if (isPreviousDigit.get()) {
      if (wheelDirection.get() === "increase") {
        return {
          opacity: 1,
          transform: [
            {
              translateY: withSpring(-translateDistance, SPRING_CONFIG),
            },
          ],
        };
      }

      if (wheelDirection.get() === "decrease") {
        return {
          opacity: 1,
          transform: [
            {
              translateY: withSpring(translateDistance, SPRING_CONFIG),
            },
          ],
        };
      }
    }

    return {
      opacity: isCurrentDigit.get() ? 1 : 0,
      transform: [
        {
          translateY: isCurrentDigit.get() ? 0 : 0,
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
