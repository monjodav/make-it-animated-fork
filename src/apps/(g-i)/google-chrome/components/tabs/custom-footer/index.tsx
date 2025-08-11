import React, { FC } from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions, Platform } from "react-native";
import { useTabsScreenAnimated } from "../../../lib/providers/tabs-screen-animated-provider";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { AddTabButton } from "./add-tab-button";
import { EditButton } from "./edit-button";
import { useTabsStore } from "../../../lib/store/tabs";
import { useFooterHeight } from "../../../lib/hooks/use-footer-height";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// google-chrome-footer-animation 🔽
// Footer replicates Chrome's modal-style toolbar:
// - Becomes translucent (blur) only when content beneath can scroll under it
// - Cross-fades between solid color and blur to avoid flicker
// - Height/padding integrate safe-area insets to match native spacing

export const CustomFooter: FC = () => {
  const { height: screenHeight } = useWindowDimensions();

  const { bottomInset, netHeight, scrollViewPaddingBottom } = useFooterHeight();

  const focusedTabName = useTabsStore.use.focusedTabName();

  const { offsetY, contentHeight } = useTabsScreenAnimated();

  // Derived flag that drives blur visibility.
  // WHY: Blur should appear only when there's scrollable content behind the footer.
  // Calculation compares current visible bottom (screenHeight + padding) to the remaining content height.
  // If remaining content (contentHeight - offsetY) exceeds the viewport bottom, we have content under the footer.
  const showBlur = useDerivedValue(() => {
    const focusedContentHeight = contentHeight.value[focusedTabName];
    const screenHeightWithoutFooter = screenHeight + scrollViewPaddingBottom;

    return focusedContentHeight - offsetY.value > screenHeightWithoutFooter;
  });

  // Fade the blur in/out quickly to feel responsive to scroll.
  // 50ms timing keeps transitions imperceptible yet prevents harsh toggles.
  const rBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showBlur.value ? 1 : 0, { duration: 50 }),
    };
  });

  // Cross-fade solid color with blur on iOS to avoid double-darkening.
  // Android: keep opaque bg (no BlurView) for performance and platform parity.
  // iOS: delay hiding color by 50ms to let BlurView settle, preventing flash-on-toggle.
  const rColorBgStyle = useAnimatedStyle(() => {
    if (Platform.OS === "android") {
      return {
        opacity: 1,
      };
    }

    return {
      opacity: showBlur.value ? withDelay(50, withTiming(0)) : 1,
    };
  });

  return (
    <View
      className="absolute bottom-0 left-0 right-0 pt-1.5"
      style={{ paddingBottom: bottomInset + 8 }}
    >
      {/**
       * Layering strategy:
       * - Solid color layer (always present). On iOS it cross-fades with blur.
       * - iOS BlurView sits above and is opacity-driven by showBlur.
       * WHY: Keep z-order stable and animate opacity only to avoid layout thrash.
       */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          className="bg-neutral-950"
          style={[StyleSheet.absoluteFill, rColorBgStyle]}
        />
        {Platform.OS === "ios" && (
          <Animated.View style={[StyleSheet.absoluteFill, rBlurStyle]}>
            <BlurView tint="systemThickMaterialDark" style={StyleSheet.absoluteFill} />
          </Animated.View>
        )}
      </View>
      {/**
       * Toolbar content area.
       * - netHeight excludes bottom inset so buttons align visually to Chrome's compact footer.
       * - Horizontal padding mirrors Chrome spacing and keeps hit targets clear of screen edges.
       */}
      <View className="px-5 flex-row items-center justify-between" style={{ height: netHeight }}>
        <EditButton />
        <AddTabButton />
        <Pressable onPress={simulatePress}>
          <Text className="text-lg font-medium text-stone-200">Done</Text>
        </Pressable>
      </View>
    </View>
  );
};

// google-chrome-footer-animation 🔼
