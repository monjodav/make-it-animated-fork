import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { View, StyleSheet, Text, Pressable, useWindowDimensions } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colorKit } from "reanimated-color-picker";
import { Dots } from "../components/dots";
import { FeatureItem } from "../components/feature-item";

const HEADER_HEIGHT = 50;
const GRADIENT_HEIGHT = 50;

type OnboardingItem = {
  title: string;
  description: string;
};

const data: OnboardingItem[] = [
  {
    title: "The easiest way to...",
    description: "Track what you eat ✍️",
  },
  {
    title: "The easiest way to...",
    description: "Learn how your diet affects you 🧠",
  },
  {
    title: "And coming soon...",
    description: "Find food that's perfect for you 🥗",
  },
];

export const Onboarding: FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const activeIndex = useSharedValue(0);
  const prevIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      prevIndex.set(activeIndex.get());
    },
    onScroll: (event) => {
      activeIndex.set(Math.floor(event.contentOffset.x / width + 0.5));
    },
  });

  return (
    <View className="flex-1 bg-[#F7F5ED]">
      <View
        className="absolute left-0 right-0 items-center justify-center"
        style={{ height: HEADER_HEIGHT, top: insets.top + 8 }}
      >
        <View className="w-12 h-12 rounded-[17px] bg-[#3C5627]" style={styles.borderCurve} />
        <Pressable className="absolute right-6 z-50" onPress={simulatePress}>
          <Text className="font-medium text-[#3C5627]">Sign in</Text>
        </Pressable>
      </View>
      <Animated.FlatList
        data={data}
        renderItem={() => (
          <View className="flex-1 items-center justify-center" style={{ width }}>
            <View className="w-3/4 h-full rounded-[40px] bg-white" style={styles.borderCurve} />
          </View>
        )}
        contentContainerStyle={{ paddingTop: insets.top + HEADER_HEIGHT + 28 }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <View
        className="absolute bottom-0 left-0 right-0 bg-[#F7F5ED] px-8 pt-6"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <LinearGradient
          colors={[colorKit.setAlpha("#F7F5ED", 0).hex(), "#F7F5ED"]}
          style={styles.gradient}
        />
        <View className="items-center mb-10">
          <Text className="text-2xl font-semibold mb-5">The easiest way to...</Text>
          <View className="h-14 w-full mb-8 items-center justify-center">
            {data.map((item, index) => (
              <FeatureItem
                key={index}
                label={item.description}
                itemIndex={index}
                activeIndex={activeIndex}
                prevIndex={prevIndex}
              />
            ))}
          </View>
          <Dots numberOfDots={data.length} activeIndex={activeIndex} />
        </View>
        <Pressable
          className="bg-[#3C5627] h-[56px] px-3 rounded-[19px] items-center justify-center"
          style={styles.borderCurve}
          onPress={simulatePress}
        >
          <Text className="text-lg text-white font-medium">Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
  gradient: {
    position: "absolute",
    top: -GRADIENT_HEIGHT,
    left: 0,
    right: 0,
    height: GRADIENT_HEIGHT,
  },
});
