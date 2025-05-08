import React, { FC } from "react";
import { useWindowDimensions } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

// threads-home-header-tabs-animation 🔽

type Props = {
  indexDecimal: SharedValue<number>;
  numberOfTabs: number;
  tabsHorizontalPadding: number;
};

export const TabIndicator: FC<Props> = ({ indexDecimal, numberOfTabs, tabsHorizontalPadding }) => {
  const { width } = useWindowDimensions();

  const tabBarItemWidth = (width - tabsHorizontalPadding * 2) / numberOfTabs;

  const rIndicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(indexDecimal.value, [0, 1], [0, tabBarItemWidth]);

    return {
      width: tabBarItemWidth,
      transform: [{ translateX: translateX + tabsHorizontalPadding }],
    };
  });

  return <Animated.View className="h-px rounded-full bg-white" style={rIndicatorStyle} />;
};

// threads-home-header-tabs-animation 🔼
