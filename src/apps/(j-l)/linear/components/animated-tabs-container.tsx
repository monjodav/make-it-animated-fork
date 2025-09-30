import { FC, PropsWithChildren } from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useSearch } from "../lib/providers/search-provider";

export const AnimatedTabsContainer: FC<PropsWithChildren> = ({ children }) => {
  const { searchProgress } = useSearch();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(searchProgress.get(), [0, 1], [1, 0]),
    };
  });

  return (
    <Animated.View className="flex-1" style={rContainerStyle}>
      {children}
    </Animated.View>
  );
};
