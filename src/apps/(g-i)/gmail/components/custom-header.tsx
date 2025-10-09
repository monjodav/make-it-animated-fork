import { Menu } from "lucide-react-native";
import React, { FC } from "react";
import { View, TextInput } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useHeaderHeight } from "../lib/hooks/use-header-height";
import { useAnimatedScrollList } from "../lib/providers/animated-scroll-list-provider";
import { scheduleOnRN } from "react-native-worklets";

// gmail-header-scroll-animation 🔽

// Base threshold distance (150px) determines when header snapping behavior activates
// This creates a "dead zone" where small scrolls don't trigger header animations
// Prevents jittery behavior from accidental micro-scrolls or scroll momentum
const _thresholdBase = 150;

export const CustomHeader: FC = () => {
  const { safeAreaHeight, searchBarHeight } = useHeaderHeight();

  // Central animation state from provider - coordinates header with bottom tab bar animations
  // listOffsetY: Real-time scroll position for interpolation calculations
  // isDragging: Prevents auto-scroll during user interaction
  // scrollDirection: Drives directional animation logic (to-top vs to-bottom)
  // offsetYAnchorOnChangeDirection: Anchor point when scroll direction changes
  const { listRef, listOffsetY, isDragging, scrollDirection, offsetYAnchorOnChangeDirection } =
    useAnimatedScrollList();

  // Search bar animation state - dual value system for smooth transitions
  // Primary values (opacity, translateY) drive current animation state
  // Anchor values preserve state at direction change points for seamless transitions
  const opacity = useSharedValue(1); // Current search bar opacity (0-1)
  const opacityAnchor = useSharedValue(1); // Opacity at last direction change
  const translateY = useSharedValue(0); // Current vertical offset (negative = up)
  const translateYAnchor = useSharedValue(0); // TranslateY at last direction change
  const threshold = useSharedValue(0); // Dynamic threshold for snapping behavior

  // Direction change handler - preserves animation state for smooth transitions
  // Captures current animation values as new anchor points when scroll direction reverses
  // This prevents jarring jumps by maintaining visual continuity across direction changes
  useAnimatedReaction(
    () => scrollDirection.value,
    (current, previous) => {
      // Store current animation state as new baseline for next direction
      opacityAnchor.value = opacity.value;
      translateYAnchor.value = translateY.value;
      // Reset threshold when switching from up-scroll to down-scroll during drag
      // Allows immediate header hiding without waiting for threshold distance
      if (isDragging.value && previous === "to-top" && current === "to-bottom") {
        threshold.value = 0;
      }
    }
  );

  // Dynamic threshold management based on scroll position
  // Activates snapping behavior only when scrolled beyond base threshold
  // Prevents threshold activation during active user interaction (isDragging)
  useAnimatedReaction(
    () => listOffsetY.value,
    (currentOffset) => {
      // Activate threshold when scrolled beyond base distance (not dragging)
      if (
        currentOffset > _thresholdBase &&
        threshold.value !== _thresholdBase &&
        !isDragging.value
      ) {
        threshold.value = _thresholdBase;
      }
      // Deactivate threshold when scrolled back to top (not dragging)
      else if (currentOffset <= _thresholdBase && threshold.value !== 0 && !isDragging.value) {
        threshold.value = 0;
      }
    }
  );

  // Programmatic scroll helper for header snapping behavior
  // Enables smooth auto-scroll to complete partial header hide/show animations
  const scrollTo = (offset: number) => {
    listRef.current?.scrollToOffset({ offset, animated: true });
  };

  // Smart snapping behavior when user stops dragging
  // Completes partial header animations to prevent "stuck" states
  // Only triggers when header is partially visible (0 < opacity < 1)
  useAnimatedReaction(
    () => isDragging.value,
    (current, previous) => {
      // Trigger when drag ends (current=false, previous=true)
      if (!current && previous) {
        // Check if header is in intermediate state (partially visible)
        const isSearchbarVisible = opacity.value > 0 && opacity.value < 1;

        // Snap to fully visible when scrolling up with partial header
        if (scrollDirection.value === "to-top" && isSearchbarVisible) {
          scheduleOnRN(scrollTo, listOffsetY.value - searchBarHeight);
        }
        // Snap to fully hidden when scrolling down with partial header
        if (scrollDirection.value === "to-bottom" && isSearchbarVisible) {
          scheduleOnRN(scrollTo, listOffsetY.value + searchBarHeight);
        }
      }
    }
  );

  // Main search bar animation style - handles both directions with different interpolation ranges
  const rSearchBarStyle = useAnimatedStyle(() => {
    // DOWN-SCROLL ANIMATION: Hide header progressively
    if (scrollDirection.value === "to-bottom") {
      // Input range: from direction change point to searchBarHeight distance beyond
      // Creates smooth 48px transition zone for header hiding
      const inputRange = [
        offsetYAnchorOnChangeDirection.value, // Start of hiding animation
        offsetYAnchorOnChangeDirection.value + searchBarHeight, // Complete hide point (48px later)
      ];

      // Opacity: fade from anchor value to fully transparent
      // Uses anchor value to maintain continuity from previous direction
      opacity.value = interpolate(
        listOffsetY.value,
        inputRange,
        [opacityAnchor.value, 0], // Fade out completely
        Extrapolation.CLAMP // Prevent over-animation beyond range
      );
      // TranslateY: slide up by full header height (negative = upward)
      // Moves header completely above viewport for clean hide effect
      translateY.value = interpolate(
        listOffsetY.value,
        inputRange,
        [translateYAnchor.value, -searchBarHeight], // Slide up 48px
        Extrapolation.CLAMP
      );
    }

    // UP-SCROLL ANIMATION: Show header with three-point interpolation
    if (scrollDirection.value === "to-top") {
      // Three-point input range creates staged reveal animation
      // Point 1: Start showing, Point 2: Anchor state, Point 3: Direction change
      const inputRange = [
        offsetYAnchorOnChangeDirection.value - threshold.value - searchBarHeight, // Start reveal
        offsetYAnchorOnChangeDirection.value - threshold.value, // Reach anchor state
        offsetYAnchorOnChangeDirection.value, // Direction change point
      ];

      // Opacity: Three-stage transition for smooth reveal
      // Stage 1: Fade to full opacity, Stage 2-3: Maintain anchor value
      opacity.value = interpolate(
        listOffsetY.value,
        inputRange,
        [1, opacityAnchor.value, opacityAnchor.value], // Full → anchor → anchor
        Extrapolation.CLAMP
      );

      // TranslateY: Three-stage position transition
      // Stage 1: Move to natural position, Stage 2-3: Maintain anchor position
      translateY.value = interpolate(
        listOffsetY.value,
        inputRange,
        [0, translateYAnchor.value, translateYAnchor.value], // Natural → anchor → anchor
        Extrapolation.CLAMP
      );
    }

    // Return combined animation style object
    // Opacity controls visibility fade, translateY controls vertical sliding
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    // Fixed header container - positioned above all content
    <View className="absolute top-0 left-0 right-0">
      {/* Safe area background - accounts for notch/status bar with semi-transparent overlay */}
      <View style={{ height: safeAreaHeight }} className="bg-neutral-900/75" />
      {/* Animated search bar - applies opacity and translateY transformations */}
      <Animated.View className="px-5 flex-row items-center" style={rSearchBarStyle}>
        {/* Search input with fixed height matching searchBarHeight constant (48px) */}
        <TextInput
          className="flex-1 bg-neutral-800 rounded-xl font-medium px-14 text-neutral-200"
          style={{ height: searchBarHeight }}
          placeholder="Search in mail"
          placeholderTextColor="darkgray"
        />
        {/* Menu icon positioned absolutely over input field */}
        <View className="absolute left-8">
          <Menu size={24} color="lightgray" />
        </View>
        {/* Profile avatar positioned absolutely on right side */}
        <View className="absolute right-8 w-8 h-8 rounded-full bg-[#e9967a]/25" />
      </Animated.View>
    </View>
  );
};

// gmail-header-scroll-animation 🔼
