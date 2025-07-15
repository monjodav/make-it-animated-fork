import React, { FC } from "react";

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { View } from "react-native";
import { HomeHeader, Scroll_Distance } from "../components/home-header";
import { Carousel } from "../components/carousel";
import { useScrollViewOffset } from "@/src/shared/lib/hooks/use-scroll-view-offset";

// colorsapp-home-header-animation 🔽

const Home: FC = () => {
  const { scrollOffsetY, scrollHandler } = useScrollViewOffset();

  const animatedHeight = useAnimatedStyle(() => ({
    height: withTiming(
      interpolate(scrollOffsetY.value, [0, Scroll_Distance * 2], [8, 1], Extrapolation.CLAMP)
    ),
  }));

  return (
    <View className="flex-1 bg-[#231E2B]">
      <HomeHeader scrollOffsetY={scrollOffsetY} />
      <Animated.View className="overflow-hidden" style={animatedHeight}>
        <View className="h-2 w-full bg-[#1B1721]" />
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View className="mt-5">
          {/* colorsapp-card-blurry-circles-animation 🔽 */}
          <Carousel />
          {/* colorsapp-card-blurry-circles-animation 🔼 */}
        </View>
        <View className="h-2 w-full bg-[#1B1721] my-5" />
        <View className="h-[300px]" />
        <View className="h-2 w-full bg-[#1B1721] my-5" />
        <View className="h-[300px]" />
        <View className="h-2 w-full bg-[#1B1721] my-5" />
        <View className="h-[300px]" />
        <View className="absolute -bottom-[1000px] left-0 right-0 h-[1000px] bg-[#1B1721]" />
      </Animated.ScrollView>
    </View>
  );
};

export default Home;

// colorsapp-home-header-animation 🔼
