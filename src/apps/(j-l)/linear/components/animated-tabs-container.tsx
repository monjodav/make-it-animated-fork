import { FC, PropsWithChildren } from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useSearch } from "../lib/providers/search-provider";

export const AnimatedTabsContainer: FC<PropsWithChildren> = ({ children }) => {
  const { searchProgress } = useSearch();

  const rContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(searchProgress.get(), [0, 1], [0, 20]);
    const opacity = interpolate(searchProgress.get(), [0, 0.5, 1], [1, 0, 0]);
    return {
      transform: [
        {
          translateY,
        },
      ],
      opacity,
    };
  });

  return (
    <Animated.View className="flex-1" style={rContainerStyle}>
      {children}
    </Animated.View>
  );
};
