import React, { FC } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Tab } from ".";

// x-top-tabs-indicator-animation 🔽

const _duration = 200;

type Props = {
  activeTab: Tab;
  tabBarOffsetX: SharedValue<number>;
  tabWidths: SharedValue<number[]>;
  tabOffsets: SharedValue<number[]>;
};

export const TabIndicator: FC<Props> = ({ activeTab, tabBarOffsetX, tabWidths, tabOffsets }) => {
  const rIndicatorStyle = useAnimatedStyle(() => {
    const left = withTiming(
      interpolate(activeTab, Object.keys(tabOffsets.value).map(Number), tabOffsets.value),
      {
        duration: _duration,
      }
    );

    const width = withTiming(
      interpolate(activeTab, Object.keys(tabWidths.value).map(Number), tabWidths.value),
      {
        duration: _duration,
      }
    );

    return {
      left,
      width,
      transform: [{ translateX: -tabBarOffsetX.value }],
    };
  });

  return (
    <Animated.View
      className="absolute bottom-0 w-full h-1 rounded-full bg-[#1D9BF0]"
      style={rIndicatorStyle}
    />
  );
};

// x-top-tabs-indicator-animation 🔼
