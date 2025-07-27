import React from "react";
import { Text } from "react-native";
import { useAttachFileMenu } from "../../lib/providers/attach-file-menu";
import { ChevronRight } from "lucide-react-native";
import Animated, { useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// grok-attach-file-menu-animation 🔽

// Animated.createAnimatedComponent enables position and opacity animations on Pressable
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// 350ms duration provides smooth, deliberate animation without feeling sluggish
const DURATION = 350;
// Ease-in-out creates natural acceleration/deceleration for polished feel
const EASING = Easing.inOut(Easing.ease);

export const RecentPhotos = () => {
  const insets = useSafeAreaInsets();

  const { isMenuOpen } = useAttachFileMenu();

  // Triple animation: opacity fade + horizontal slide + vertical slide
  // Creates sophisticated entrance that draws attention to header element
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      // Fade animation for smooth appearance/disappearance
      opacity: withTiming(isMenuOpen.get() ? 1 : 0, { duration: DURATION, easing: EASING }),
      // Horizontal slide: 16px (open) to 24px (closed) creates subtle left movement
      left: withTiming(isMenuOpen.get() ? 16 : 24, { duration: DURATION, easing: EASING }),
      // Vertical slide: +8px movement (40px vs 32px) adds dynamic entrance effect
      // Safe area top ensures proper positioning below status bar/notch
      top: withTiming(isMenuOpen.get() ? insets.top + 40 : insets.top + 32, {
        duration: DURATION,
        easing: EASING,
      }),
    };
  });

  return (
    <AnimatedPressable
      style={rContainerStyle}
      className="absolute flex-row items-center gap-1"
      onPress={simulatePress}
    >
      <Text className="text-neutral-400 text-xl font-semibold">Recent Photos</Text>
      <ChevronRight size={28} color="gray" />
    </AnimatedPressable>
  );
};

// grok-attach-file-menu-animation 🔼
