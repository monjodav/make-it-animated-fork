import React, { FC } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useHeaderHeight } from "../lib/hooks/use-header-height";
import { useAnimatedScrollList } from "../lib/providers/animated-scroll-list-provider";
import { useBottomTabBarHeight } from "../lib/hooks/use-bottom-tab-bar-height";

// gmail-header-scroll-animation 🔽
// gmail-bottom-tab-bar-and-fab-animation 🔽

// Main content list component - drives all Gmail scroll animations
// Uses Animated.FlatList for optimal performance with coordinated header/tab bar animations
export const ContentList: FC = () => {
  const { headerHeight, searchBarHeight } = useHeaderHeight();
  const { grossHeight } = useBottomTabBarHeight();

  // Centralized animation state - connects to provider for coordinated animations
  // listRef: enables programmatic scrolling for header snapping behavior
  // scrollHandler: optimized worklet that updates all animation values on UI thread
  const { listRef, scrollHandler } = useAnimatedScrollList();

  return (
    // Animated.FlatList enables native-driven animations without JS bridge overhead
    // Critical for smooth 60fps header and bottom tab bar animations
    <Animated.FlatList
      ref={listRef} // Required for programmatic scrolling (header snapping)
      data={Array.from({ length: 40 })} // Mock email data for demo
      renderItem={() => (
        // Email item mockup - represents Gmail inbox list item
        <View className="flex-row gap-6">
          <View className="w-12 h-12 rounded-full bg-neutral-800/50" />
          <View className="flex-1 gap-2">
            <View className="w-full h-3 rounded-md bg-neutral-800/50" />
            <View className="w-3/4 h-3 rounded-md bg-neutral-800/50" />
          </View>
          <View className="justify-between items-end">
            <View className="w-10 h-3 rounded-md bg-neutral-800/50" />
            <View className="w-4 h-4 rounded-md bg-neutral-800/50" />
          </View>
        </View>
      )}
      contentContainerClassName="gap-8 px-5"
      contentContainerStyle={{
        paddingTop: headerHeight + 28,
        paddingBottom: grossHeight + 16,
      }}
      onScroll={scrollHandler} // Unified handler updates all animation systems
      scrollEventThrottle={1000 / 60} // 16.67ms = 60fps for smooth animations
      scrollIndicatorInsets={{ top: searchBarHeight }} // Adjust scroll bar for header
      indicatorStyle="white" // White scroll indicator for dark theme
    />
  );
};

// gmail-bottom-tab-bar-and-fab-animation 🔼
// gmail-header-scroll-animation 🔼
