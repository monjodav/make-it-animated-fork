import React, { FC } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

// discord-top-tabs-indicator-animation 🔽

type Props = {
  indexDecimal: SharedValue<number>;
  width: number;
};

export const TabIndicator: FC<Props> = ({ indexDecimal, width }) => {
  const rIndicatorStyle = useAnimatedStyle(() => {
    const translateX = withSpring(interpolate(indexDecimal.value, [0, 1], [0, width]), {
      stiffness: 180,
      damping: 20,
    });

    return {
      width,
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View
      className="absolute rounded-full bg-[#101217] p-[5px]"
      style={[
        rIndicatorStyle,
        {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          borderCurve: "continuous",
        },
      ]}
    >
      <View className="bg-[#30323B] w-full h-full rounded-full" />
    </Animated.View>
  );
};

// discord-top-tabs-indicator-animation 🔼
