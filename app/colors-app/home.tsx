import React, { FC } from "react";

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import { View } from "react-native";
import { HomeHeader, Scroll_Distance } from "@/components/colors-app/home-header";

// colorsapp-home-header-animation 🔽

const HomeScreen: FC = () => {
  const animatedRef = useAnimatedRef<ScrollView>();
  const scrollOffsetY = useScrollViewOffset(animatedRef);

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
      <Animated.ScrollView ref={animatedRef} showsVerticalScrollIndicator={false}>
        <View className="mt-5">
          {/* <Carousel /> */}
          <View className="h-[300px]" />
        </View>
        <View className="h-2 w-full bg-[#1B1721] my-5" />
        <View className="h-[300px]" />
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

export default HomeScreen;

// colorsapp-home-header-animation 🔼
