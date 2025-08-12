import React from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useAnimatedScrollHandler } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { PaginationDots } from "./pagination-dots";
import { InfoItem } from "./info-card";

// fuse-info-cards-carousel-animation 🔽

// Number of cards controls both paging distance and dots count. Keep in sync with PaginationDots.
const data = Array.from({ length: 8 });

// NOTE: This component is disabled on Android for two reasons:
// 1. Nested horizontal list inside parent horizontal list performs poorly on Android
// 2.Tricky entering and exiting interpolation of carousel card works poorly on Android
export const InfoCarousel: React.FC = () => {
  // Shared horizontal scroll position coordinating cards and pagination
  const scrollOffsetX = useSharedValue(0);

  // UI-thread scroll handler keeps animations in sync at 60fps
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffsetX.set(event.contentOffset.x);
  });

  return (
    <View className="gap-3">
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // Snap per-card to simplify interpolation math (index = x / width)
        pagingEnabled
        onScroll={scrollHandler}
        // ~60fps updates for smooth opacity/translation/blur interpolations
        scrollEventThrottle={16}
      >
        {data.map((_, index) => (
          <InfoItem key={index} index={index} scrollOffsetX={scrollOffsetX} />
        ))}
      </Animated.ScrollView>
      {/* Dots consume the same shared value for lockstep feedback */}
      <PaginationDots numberOfItems={data.length} scrollOffsetX={scrollOffsetX} />
    </View>
  );
};

// fuse-info-cards-carousel-animation 🔼
