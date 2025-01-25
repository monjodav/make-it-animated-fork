import React, { FC } from "react";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useIosHeader } from "./provider";

type Props = {
  bigTitle: string | undefined;
};

export const BigTitle: FC<Props> = ({ bigTitle }) => {
  const { listOffsetY, bigTitleHeight } = useIosHeader();

  const rBigTitleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(listOffsetY.value, [0, -150], [1, 1.1], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <Animated.Text
      onLayout={({ nativeEvent }) => (bigTitleHeight.value = nativeEvent.layout.height)}
      className="text-neutral-300 font-bold text-3xl"
      style={[rBigTitleStyle, { transformOrigin: "left" }]}
    >
      {bigTitle ?? ""}
    </Animated.Text>
  );
};
