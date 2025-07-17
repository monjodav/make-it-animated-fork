import React, { FC, PropsWithChildren } from "react";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfileImageAnimation } from "../lib/providers/profile-image-animation-provider";

// threads-profile-picture-animation 🔽

export const AnimatedScrollView: FC<PropsWithChildren> = ({ children }) => {
  // Get safe area insets to properly pad content from notches and system UI
  const insets = useSafeAreaInsets();

  // Get shared scroll handler that tracks position for profile image animation
  // This creates the synchronized connection between scrolling and animation
  const { scrollHandler } = useProfileImageAnimation();

  return (
    <Animated.ScrollView
      className="bg-neutral-950"
      contentContainerClassName="px-4"
      contentContainerStyle={{
        paddingTop: insets.top + 30,
      }}
      // Connect to the shared scroll handler for position tracking
      // This enables the profile image to update position during scrolling
      onScroll={scrollHandler}
      // 16ms ~= 60fps for smooth animations without performance impact
      // Crucial for fluid scroll-based position tracking
      scrollEventThrottle={16}
    >
      {children}
    </Animated.ScrollView>
  );
};

// threads-profile-picture-animation 🔼
