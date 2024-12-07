import React, { FC } from "react";
import { useWindowDimensions } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

type Props = {
  tabWidths: SharedValue<number[]>;
  tabOffsets: SharedValue<number[]>;
  tabBarOffsetX: SharedValue<number>;
  listOffsetX: SharedValue<number>;
};

export const TabIndicator: FC<Props> = ({ tabWidths, tabOffsets, tabBarOffsetX, listOffsetX }) => {
  const { width: windowWidth } = useWindowDimensions();

  const rIndicatorStyle = useAnimatedStyle(() => {
    const left = interpolate(
      listOffsetX.value / windowWidth,
      Object.keys(tabOffsets.value).map(Number),
      tabOffsets.value
    );

    const width = interpolate(
      listOffsetX.value / windowWidth,
      Object.keys(tabWidths.value).map(Number),
      tabWidths.value
    );

    return {
      left,
      width,
      transform: [
        {
          translateX: -tabBarOffsetX.value,
        },
      ],
    };
  });

  return (
    <Animated.View
      className="absolute h-[3px] bottom-0 rounded-full bg-neutral-400"
      style={rIndicatorStyle}
    />
  );
};
