import React, { FC } from "react";
import { TouchableOpacity } from "react-native";
import { Pencil } from "lucide-react-native";
import { useAnimatedScrollList } from "../lib/providers/animated-scroll-list-provider";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useBottomTabBarHeight } from "../lib/hooks/use-bottom-tab-bar-height";

// gmail-bottom-tab-bar-and-fab-animation 🔽

// Animated.createAnimatedComponent enables native-driven animations on TouchableOpacity
// Provides smooth size and position transitions without JS bridge overhead
const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

// Button dimensions for expanded and collapsed states
const _btnWidth = 125; // Full width shows "Compose" text
const _btnHeight = 50; // Height remains constant, width collapses to create circle

// Animation duration (200ms) - faster than tab bar (300ms) for responsive feel
// Quick transitions prevent lag during rapid scroll direction changes
const _duration = 200;

// Floating Action Button with scroll-based size and position animations
// Coordinates with tab bar animation for unified Gmail UX
export const ComposeBtn: FC = () => {
  const { netHeight, grossHeight } = useBottomTabBarHeight();

  // Shared animation state from centralized provider
  // Enables coordinated animations with header and tab bar components
  const { listOffsetY, offsetYAnchorOnBeginDrag, scrollDirection } = useAnimatedScrollList();

  // Main button animation - handles size and position changes
  const rContainerStyle = useAnimatedStyle(() => {
    // Compact state: scrolled beyond drag start AND scrolling down
    // Matches tab bar hide condition for coordinated UX
    if (
      listOffsetY.value >= offsetYAnchorOnBeginDrag.value &&
      scrollDirection.value === "to-bottom"
    ) {
      return {
        // Collapse to circle: width becomes equal to height (50x50)
        width: withTiming(_btnHeight, { duration: _duration }),
        height: withTiming(_btnHeight, { duration: _duration }),
        // Move up by tab bar net height to sit above hidden tab bar
        transform: [{ translateY: withTiming(netHeight, { duration: _duration }) }],
      };
    }

    // Expanded state: show full button with text
    return {
      // Full width (125px) accommodates "Compose" text
      width: withTiming(_btnWidth, { duration: _duration }),
      height: withTiming(_btnHeight, { duration: _duration }),
      // Natural position above visible tab bar
      transform: [{ translateY: withTiming(0, { duration: _duration }) }],
    };
  });

  // Text fade animation - hides "Compose" label when button collapses
  const rTextOpacityStyle = useAnimatedStyle(() => {
    // Hide text condition: same as button collapse condition
    if (
      listOffsetY.value >= offsetYAnchorOnBeginDrag.value &&
      scrollDirection.value === "to-bottom"
    ) {
      // Fade out faster (100ms) than button resize for clean transition
      // Text disappears before button starts shrinking
      return { opacity: withTiming(0, { duration: _duration / 2 }) };
    }

    // Show text with full animation duration for smooth fade-in
    return { opacity: withTiming(1, { duration: _duration }) };
  });

  return (
    <AnimatedPressable
      activeOpacity={0.85}
      className="absolute right-6 flex-row gap-3 bg-neutral-800 rounded-full overflow-hidden items-center px-4 shadow-md"
      style={[rContainerStyle, { bottom: grossHeight + 16 }]}
    >
      <Pencil size={20} color="#e9967a" />
      <Animated.Text
        style={rTextOpacityStyle}
        className="absolute left-12 text-base text-[#e9967a]"
        maxFontSizeMultiplier={1}
      >
        Compose
      </Animated.Text>
    </AnimatedPressable>
  );
};

// gmail-bottom-tab-bar-and-fab-animation 🔼
