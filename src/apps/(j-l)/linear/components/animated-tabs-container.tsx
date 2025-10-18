import { FC, PropsWithChildren, use } from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { SearchTransitionContext } from "@/app/(apps)/(j-l)/linear/_layout";

export const AnimatedTabsContainer: FC<PropsWithChildren> = ({ children }) => {
  const { transitionProgress } = use(SearchTransitionContext);

  const rContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(transitionProgress.get(), [0, 1], [0, 100]);
    const scale = interpolate(transitionProgress.get(), [0, 1], [1, 0.85]);
    return {
      transform: [
        {
          translateY,
        },
        {
          scale,
        },
      ],
    };
  });

  return (
    <Animated.View className="flex-1" style={rContainerStyle}>
      {children}
    </Animated.View>
  );
};
