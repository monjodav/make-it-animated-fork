import React, { FC, PropsWithChildren } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import { useAnimatedStyle } from "react-native-reanimated";

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

    if (userIndex === listCurrentIndex.get()) {
      const rotateY = interpolate(progress, [0, 1], [0, -90], Extrapolation.CLAMP);
      const translateX = interpolate(
        progress,
        [0, 1],
        [0, -screenWidth / 10000],
        Extrapolation.CLAMP
      );
      return {
        transformOrigin: "right",
        transform: [{ perspective: 2000 }, { translateX }, { rotateY: `${rotateY}deg` }],
      };
    }

    if (userIndex === listCurrentIndex.get() + 1) {
      const rotateY = interpolate(progress, [0, 1], [90, 0], Extrapolation.CLAMP);
      const translateX = interpolate(
        progress,
        [0, 1],
        [screenWidth / 10000, 0],
        Extrapolation.CLAMP
      );
      return {
        transformOrigin: "left",
        transform: [{ perspective: 2000 }, { translateX }, { rotateY: `${rotateY}deg` }],
      };
    }

    return {};
  });

  return (
    <Animated.View style={[{ width: screenWidth }, rContainerStyle]}>{children}</Animated.View>
  );
};
