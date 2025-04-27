import React, { FC } from "react";
import { useWindowDimensions } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

// threads-home-header-tabs-animation 🔽

type Props = {
  activeTabIndex: SharedValue<number>;
  numberOfTabs: number;
  tabsHorizontalPadding: number;
};

export const TabIndicator: FC<Props> = ({
  activeTabIndex,
  numberOfTabs,
  tabsHorizontalPadding,
}) => {
  const { width } = useWindowDimensions();

  const tabWidth = (width - tabsHorizontalPadding * 2) / numberOfTabs;

  const rIndicatorStyle = useAnimatedStyle(() => {
    const width = interpolate(activeTabIndex.value, [-1, 0, 1, 2], [0, tabWidth, tabWidth, 0]);
    const translateX = interpolate(activeTabIndex.value, [0, 1], [0, tabWidth]);

    return {
      width,
      transform: [{ translateX: translateX + tabsHorizontalPadding }],
    };
  });

  return <Animated.View className="h-px rounded-full bg-white" style={rIndicatorStyle} />;
};

// threads-home-header-tabs-animation 🔼
