import React, { FC, PropsWithChildren } from "react";
import { Platform, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import { useAnimatedStyle } from "react-native-reanimated";

// instagram-stories-carousel-animation 🔽

const ANGLE = Platform.OS === "android" ? 75 : 90;

type Props = {
  listAnimatedIndex: SharedValue<number>;
  userIndex: number;
};

export const Container: FC<PropsWithChildren<Props>> = ({
  children,
  listAnimatedIndex,
  userIndex,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const listCurrentIndex = useDerivedValue(() => {
    return Math.floor(listAnimatedIndex.get());
  });

  const rContainerStyle = useAnimatedStyle(() => {
    const progress = listAnimatedIndex.get() - listCurrentIndex.get();

    const translateX =
      Platform.OS === "android"
        ? interpolate(
            listAnimatedIndex.get(),
            [userIndex - 1, userIndex, userIndex + 1],
            [-10, 0, 10],
            Extrapolation.CLAMP
          )
        : 0;

    if (userIndex === listCurrentIndex.get()) {
      const rotateY = interpolate(progress, [0, 1], [0, -ANGLE], Extrapolation.CLAMP);
      return {
        transformOrigin: "right",
        transform: [{ perspective: screenWidth * 4 }, { translateX }, { rotateY: `${rotateY}deg` }],
      };
    }

    if (userIndex === listCurrentIndex.get() + 1) {
      const rotateY = interpolate(progress, [0, 1], [ANGLE, 0], Extrapolation.CLAMP);
      return {
        transformOrigin: "left",
        transform: [{ perspective: screenWidth * 4 }, { translateX }, { rotateY: `${rotateY}deg` }],
      };
    }

    return {};
  });

  return (
    <Animated.View style={[{ width: screenWidth }, rContainerStyle]}>{children}</Animated.View>
  );
};

// instagram-stories-carousel-animation 🔼
