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
  stiffness: 200,
};

type Props = {
  index: number;
  previousIndex: SharedValue<number>;
  currentIndex: SharedValue<number>;
  fontSize: number;
};

export const TranslateContainer: FC<PropsWithChildren<Props>> = ({
  children,
  index,
  previousIndex,
  currentIndex,
  fontSize,
}) => {
  const rTranslateYContainerStyle = useAnimatedStyle(() => {
    if (currentIndex.get() === index && currentIndex.get() > previousIndex.get()) {
      return {
        opacity: 1,
        transform: [
          {
            translateY: withSequence(
              withTiming(fontSize, { duration: 0 }),
              withSpring(0, SPRING_CONFIG),
            ),
          },
        ],
      };
    }

    if (currentIndex.get() === index && currentIndex.get() < previousIndex.get()) {
      return {
        opacity: 1,
        transform: [
          {
            translateY: withSequence(
              withTiming(-fontSize, { duration: 0 }),
              withSpring(0, SPRING_CONFIG),
            ),
          },
        ],
      };
    }

    if (previousIndex.get() === index && currentIndex.get() > previousIndex.get()) {
      return {
        opacity: 1,
        transform: [
          {
            translateY: withSpring(-fontSize, SPRING_CONFIG),
          },
        ],
      };
    }

    if (previousIndex.get() === index && currentIndex.get() < previousIndex.get()) {
      return {
        opacity: 1,
        transform: [
          {
            translateY: withSpring(fontSize, SPRING_CONFIG),
          },
        ],
      };
    }

    return {
      opacity: 0,
      transform: [
        {
          translateY: 0,
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
