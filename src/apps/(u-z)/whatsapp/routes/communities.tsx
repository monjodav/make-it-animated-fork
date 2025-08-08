import React from "react";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { LargeTitle } from "../components/large-title";
import { CommunitiesContent } from "../components/communities-content";

// whatsapp-header-large-title-animation 🔽

export default function Communities() {
  // Why: Aligns top padding with actual navigation header height (incl. safe areas)
  // Ensures large title starts visually below the header and measures correctly
  const headerHeight = useHeaderHeight();

  // Shared value coordinating scroll position across header title and content animations
  // Single source of truth passed to LargeTitle and CommunitiesContent
  const offsetY = useSharedValue(0);

  // Worklet: runs on UI thread for 60fps updates
  // Minimal handler keeps GC pressure low and avoids unnecessary allocations
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y;
    },
  });

  return (
    <Animated.ScrollView
      className="bg-neutral-950"
      // Top padding = header height + 16px spacing so first content (LargeTitle) isn't obscured
      contentContainerStyle={{ paddingTop: headerHeight + 16 }}
      contentContainerClassName="p-5"
      indicatorStyle="white"
      // Performance: ~60fps scroll events for smooth interpolation without flooding JS
      scrollEventThrottle={1000 / 60}
      onScroll={scrollHandler}
    >
      {/* Large title consumes offsetY to cross-fade with headerTitle based on measured baseline */}
      <LargeTitle title="Communities" offsetY={offsetY} className="mb-8" />
      <CommunitiesContent offsetY={offsetY} />
    </Animated.ScrollView>
  );
}

// whatsapp-header-large-title-animation 🔼
