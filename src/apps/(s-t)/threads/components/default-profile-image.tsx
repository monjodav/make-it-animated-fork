import React, { FC } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useProfileImageAnimation } from "../lib/providers/profile-image-animation-provider";
import { Pressable } from "react-native";
import { ProfileImageBase } from "./profile-image-base";

// threads-profile-picture-animation 🔽

// createAnimatedComponent wraps Pressable to make its style props directly animatable
// This creates a specialized worklet-driven variant that optimizes UI thread animations by:
// 1. Bypassing the React Native bridge for style updates (reduced JS-Native communication)
// 2. Preventing component tree re-renders when only opacity or transform changes
// 3. Allowing direct animation of opacity with native drivers for smooth transitions
// Critical for immediate visual feedback when transitioning between original and expanded states
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const DefaultProfileImage: FC = () => {
  // Consume shared animation context values for coordinated animations between components
  const { targetRef, onTargetLayout, defaultProfileImageSize, imageState, open } =
    useProfileImageAnimation();

  // This style controls visibility of the original image during animation
  // Ensures immediate hide when expanded image appears for seamless transition
  const rImagePlaceholderStyle = useAnimatedStyle(() => {
    return {
      opacity: imageState.value === "open" ? 0 : 1, // Binary visibility toggle based on animation state
    };
  });

  return (
    // targetRef is critical - provides position measurements for animation origin point
    // onLayout triggers measurement recalculation on any layout changes
    <Animated.View ref={targetRef} onLayout={onTargetLayout}>
      <AnimatedPressable
        className="rounded-full overflow-hidden"
        style={[
          rImagePlaceholderStyle,
          // Fixed dimensions match the initial state of the animated image
          // Creating the illusion that it's the same image being animated
          { width: defaultProfileImageSize, height: defaultProfileImageSize },
        ]}
        onPress={open} // Trigger animation start from provider context
      >
        {/* Shared base component ensures visual consistency */}
        <ProfileImageBase />
      </AnimatedPressable>
    </Animated.View>
  );
};

// threads-profile-picture-animation 🔼
