import React, { FC } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { sharedConfigs } from "../lib/constants/navigation-between-boards-animation";

// pinterest-navigation-between-boards-animation 🔽

type Props = {
  activeTabIndex: SharedValue<number>;
  tabWidths: SharedValue<number[]>;
  tabOffsets: SharedValue<number[]>;
  tabBarOffsetX: SharedValue<number>;
  listOffsetX: SharedValue<number>;
  isListScrollingX: SharedValue<boolean>;
};

export const TabIndicator: FC<Props> = ({
  activeTabIndex,
  tabWidths,
  tabOffsets,
  tabBarOffsetX,
  listOffsetX,
  isListScrollingX,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const rIndicatorStyle = useAnimatedStyle(() => {
    const left = isListScrollingX.value
      ? interpolate(
          listOffsetX.value / windowWidth,
          Object.keys(tabOffsets.value).map(Number),
          tabOffsets.value
        )
      : withTiming(tabOffsets.value[activeTabIndex.value], {
          duration: sharedConfigs.indicatorOnPressAnimDuration,
        });

    const width = isListScrollingX.value
      ? interpolate(
          listOffsetX.value / windowWidth,
          Object.keys(tabWidths.value).map(Number),
          tabWidths.value
        )
      : withTiming(tabWidths.value[activeTabIndex.value], {
          duration: sharedConfigs.indicatorOnPressAnimDuration,
        });

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

// pinterest-navigation-between-boards-animation 🔼
