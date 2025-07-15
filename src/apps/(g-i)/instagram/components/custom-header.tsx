import React, { FC } from "react";
import { View, Pressable } from "react-native";
import { Logo } from "./logo";
import { Heart, Send } from "lucide-react-native";
import { useHomeHeaderHeight } from "../lib/hooks/use-home-header-height";
import { useAnimatedScroll } from "../lib/providers/animated-scroll";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// instagram-header-on-scroll-animation 🔽

// Base header height used for interpolation calculations across all components
export const HEADER_HEIGHT = 50;
// Animation duration for smooth header reveal/hide transitions
const DURATION = 150;

export const CustomHeader: FC = () => {
  const { netHeaderHeight } = useHomeHeaderHeight();

  const {
    offsetY,
    velocityOnEndDrag,
    headerTop,
    isHeaderVisible,
    scrollDirection,
    offsetYAnchorOnBeginDrag,
  } = useAnimatedScroll();

  // Independent opacity control for smooth fade transitions
  const headerOpacity = useSharedValue(1);

  // I need this key for case when the user is not on top of the list and the header is already shown
  // so I can skip the interpolation of the header position and opacity when we are at the top of the list
  // Prevents interference between scroll-based and velocity-based animations
  const skipTopInterpolation = useSharedValue(false);

  // On top we have a bit different behavior of the list
  // so I need to check if the user is on top of the list
  // 3x multiplier creates a buffer zone where scroll-based animation takes precedence
  const isTopOfList = useDerivedValue(() => offsetY.value < netHeaderHeight * 3);
  // Velocity threshold for instant header reveal - prevents jittery animations on slow scrolls
  const isVelocityHigh = useDerivedValue(() => Math.abs(velocityOnEndDrag.value) > 1.25);

  // Manages header vertical position based on scroll context and velocity
  const rPositionContainer = useAnimatedStyle(() => {
    // Reset skip flag when back at top - allows normal scroll animation to resume
    if (offsetY.get() <= 0 && skipTopInterpolation.get()) {
      skipTopInterpolation.set(false);
    }

    // Near-top behavior: Linear interpolation from visible (0) to hidden (-netHeaderHeight)
    if (isTopOfList.get() && !skipTopInterpolation.get()) {
      headerTop.set(
        // Input range: [scroll start, header height] → Output: [visible, hidden]
        interpolate(offsetY.value, [0, netHeaderHeight], [0, -netHeaderHeight], Extrapolation.CLAMP)
      );
    }

    // Mid-scroll behavior: Velocity-based instant reveal + drag-based progressive hide
    if (!isTopOfList.get()) {
      // Fast upward scroll: Instant reveal with smooth timing animation
      if (!isHeaderVisible.get() && isVelocityHigh.get() && scrollDirection.get() === "to-top") {
        headerTop.set(withTiming(0, { duration: DURATION }));
        skipTopInterpolation.set(true); // Prevent scroll interference during reveal
      }

      // Slow scroll: Progressive hide based on drag distance from anchor point
      if (isHeaderVisible.get() && !isVelocityHigh.get()) {
        headerTop.set(
          interpolate(
            offsetY.value,
            // Input: [drag start position, drag start + header height]
            [offsetYAnchorOnBeginDrag.get(), offsetYAnchorOnBeginDrag.get() + netHeaderHeight],
            // Output: [fully visible, fully hidden]
            [0, -netHeaderHeight],
            // Prevents extrapolation beyond bounds
            Extrapolation.CLAMP
          )
        );
      }
    }

    return {
      top: headerTop.value,
    };
  });

  // Manages header opacity separately from position for smooth visual transitions
  const rOpacityContainer = useAnimatedStyle(() => {
    // Near-top: Fade out faster than position change (0.75x) for smooth visual transition
    if (isTopOfList.get() && !skipTopInterpolation.get()) {
      headerOpacity.set(
        // Fade completes at 75% of header height scroll for smoother UX
        interpolate(offsetY.value, [0, netHeaderHeight * 0.75], [1, 0], Extrapolation.CLAMP)
      );
    }

    // Mid-scroll opacity: Mirrors position logic for consistent visual behavior
    if (!isTopOfList.get()) {
      // Fast upward scroll: Instant fade-in with smooth timing
      if (!isHeaderVisible.get() && isVelocityHigh.get() && scrollDirection.get() === "to-top") {
        headerOpacity.set(withTiming(1, { duration: DURATION }));
      }

      // Slow scroll: Progressive fade-out matching position animation
      if (isHeaderVisible.get() && !isVelocityHigh.get()) {
        headerOpacity.set(
          interpolate(
            offsetY.value,
            // Same input range as position for synchronized animation
            [offsetYAnchorOnBeginDrag.get(), offsetYAnchorOnBeginDrag.get() + netHeaderHeight],
            // Opacity range: [fully opaque, fully transparent]
            [1, 0],
            Extrapolation.CLAMP
          )
        );
      }
    }

    return {
      opacity: headerOpacity.value,
    };
  });

  return (
    // Fixed positioning with high z-index for overlay behavior
    <Animated.View className="absolute left-0 right-0  bg-black z-50" style={rPositionContainer}>
      {/* Inner container handles opacity transitions while outer handles position */}
      <Animated.View
        className="flex-row items-center justify-between px-5"
        style={[{ height: netHeaderHeight }, rOpacityContainer]}
      >
        <Logo width={110} height={30} />
        <View className="flex-row items-center gap-8">
          <Pressable>
            <Heart size={22} color="white" />
          </Pressable>
          <Pressable>
            <Send size={22} color="white" />
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

// instagram-header-on-scroll-animation 🔼
