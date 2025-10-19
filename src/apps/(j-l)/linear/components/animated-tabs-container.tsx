import { FC, PropsWithChildren, use } from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { SearchTransitionContext } from "@/app/(apps)/(j-l)/linear/_layout";

// linear-search-screen-open-close-animation 🔽

export const AnimatedTabsContainer: FC<PropsWithChildren> = ({ children }) => {
  const { transitionProgress } = use(SearchTransitionContext);

  const rContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(transitionProgress.get(), [0, 0.5, 1, 1.5, 2], [1, 0, 0, 0, 1]);
    const translateY = interpolate(transitionProgress.get(), [0, 1, 2], [0, 40, 0]);
    const scale = interpolate(transitionProgress.get(), [0, 1, 2], [1, 0.97, 1]);

    return {
      opacity,
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

// linear-search-screen-open-close-animation 🔼
