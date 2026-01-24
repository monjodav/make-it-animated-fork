import React, { FC, PropsWithChildren } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  index: number;
  animatedIndex: SharedValue<number>;
};

export const ScaleContainer: FC<PropsWithChildren<Props>> = ({
  children,
  index,
  animatedIndex,
}) => {
  const rScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            animatedIndex.get(),
            [index - 1, index, index + 1],
            [0.25, 1, 0.25],
            Extrapolation.CLAMP,
          ),
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
