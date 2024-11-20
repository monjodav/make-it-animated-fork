import React, { FC } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { Tab } from "./tab-bar";

const _duration = 300;

type Props = {
  activeTab: Tab;
  tabBarOffsetX: SharedValue<number>;
  tabWidths: SharedValue<number[]>;
  tabOffsets: SharedValue<number[]>;
  isScrolling: SharedValue<boolean>;
};

export const TabIndicator: FC<Props> = ({
  activeTab,
  tabBarOffsetX,
  tabWidths,
  tabOffsets,
  isScrolling,
}) => {
  const left = useDerivedValue(() => {
    return withTiming(-tabBarOffsetX.value + tabOffsets.value[activeTab], {
      duration: isScrolling.value ? 0 : _duration,
    });
  });

  const rIndicatorStyle = useAnimatedStyle(() => {
    const width = interpolate(activeTab, Object.keys(tabWidths.value).map(Number), tabWidths.value);

    return {
      left: left.value,
      width,
    };
  });

  return (
    <Animated.View className="absolute h-full rounded-lg bg-[#28282D]" style={rIndicatorStyle} />
  );
};
