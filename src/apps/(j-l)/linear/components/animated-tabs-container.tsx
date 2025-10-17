import { FC, PropsWithChildren, use } from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { SearchTransitionContext } from "@/app/(apps)/(j-l)/linear/_layout";

export const AnimatedTabsContainer: FC<PropsWithChildren> = ({ children }) => {
  const { transitionProgress } = use(SearchTransitionContext);

  const rContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(transitionProgress.get(), [0, 1], [0, 20]);
    const opacity = interpolate(transitionProgress.get(), [0, 0.5, 1], [1, 0, 0]);
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
