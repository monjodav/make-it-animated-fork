import { FC, PropsWithChildren, use } from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { SearchTransitionContext } from "@/app/(apps)/(j-l)/linear/_layout";

// linear-search-screen-open-close-animation 🔽

// Transition semantics:
// - transitionProgress: 0 (idle) → 1 (opening) → 2 (closing) → 0 (reset)
// - We drive tabs container fade/scale/translate to emphasize the search overlay
//   and create depth during open/close.

export const AnimatedTabsContainer: FC<PropsWithChildren> = ({ children }) => {
  const { transitionProgress } = use(SearchTransitionContext);

  const rContainerStyle = useAnimatedStyle(() => {
    // Opacity curve (why):
    // - Quick dim-out as we start opening (0→0.5)
    // - Stay hidden through open state (1→1.5), then fade back on close (→2)
    const opacity = interpolate(transitionProgress.get(), [0, 0.5, 1, 1.5, 2], [1, 0, 0, 0, 1]);

    // Subtle drop (40px) adds depth under the modal; returns on close.
    // Input: 0→1→2 (phases) Output: 0→40→0 (px)
    const translateY = interpolate(transitionProgress.get(), [0, 1, 2], [0, 40, 0]);

    // Slight scale-down (3%) during overlay to suggest de-emphasis of background.
    // Input: 0→1→2 Output: 1→0.97→1
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
