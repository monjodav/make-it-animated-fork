import React, { FC } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// pinterest-navigation-between-boards-animation 🔽

type Props = {
  activeTabIndex: SharedValue<number>;
  tabWidths: SharedValue<number[]>;
  tabOffsets: SharedValue<number[]>;
  tabBarOffsetX: SharedValue<number>;
};

export const TabIndicator: FC<Props> = ({
  activeTabIndex,
  tabWidths,
  tabOffsets,
  tabBarOffsetX,
}) => {
  const rIndicatorStyle = useAnimatedStyle(() => {
    const left = withTiming(
      interpolate(
        activeTabIndex.value,
        Object.keys(tabOffsets.value).map(Number),
        tabOffsets.value
      ),
      { duration: 50 }
    );

    const width = withTiming(
      interpolate(activeTabIndex.value, Object.keys(tabWidths.value).map(Number), tabWidths.value),
      { duration: 50 }
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
      className="absolute h-[2.5px] bottom-0 rounded-full bg-neutral-300"
      style={rIndicatorStyle}
    />
  );
};

// pinterest-navigation-between-boards-animation 🔼
