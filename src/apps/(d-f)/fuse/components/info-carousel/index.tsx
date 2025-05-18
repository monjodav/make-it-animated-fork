import React from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useAnimatedScrollHandler } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { PaginationDots } from "./pagination-dots";
import { InfoItem } from "./info-card";

// fuse-info-cards-carousel-animation 🔽

const data = Array.from({ length: 8 });

// NOTE: This component is disabled on Android for two reasons:
// 1. Nested horizontal list inside parent horizontal list performs poorly on Android
// 2.Tricky entering and exiting interpolation of carousel card works poorly on Android
export const InfoCarousel: React.FC = () => {
  const scrollOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffsetX.value = event.contentOffset.x;
  });

  return (
    <View className="gap-3">
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {data.map((_, index) => (
          <InfoItem key={index} index={index} scrollOffsetX={scrollOffsetX} />
        ))}
      </Animated.ScrollView>
      <PaginationDots numberOfItems={data.length} scrollOffsetX={scrollOffsetX} />
    </View>
  );
};

// fuse-info-cards-carousel-animation 🔼
