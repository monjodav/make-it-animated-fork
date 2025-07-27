import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { View, StyleSheet, Text, Pressable, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colorKit } from "reanimated-color-picker";
import { Dots } from "../components/dots";
import { FeatureItem } from "../components/feature-item";
import { StaggeredText } from "../components/stagged-text";

// alma-onboarding-carousel-animation 🔽

const HEADER_HEIGHT = 50;
const GRADIENT_HEIGHT = 50;

type OnboardingItem = {
  description: string;
};

const data: OnboardingItem[] = [
  {
    description: "Track what you eat ✍️",
  },
  {
    description: "Learn how your diet affects you 🧠",
  },
  {
    description: "Find food that's perfect for you 🥗",
  },
];

export const Onboarding: FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const prevOffsetX = useSharedValue(0);
  const scrollDirection = useSharedValue<"to-left" | "to-right" | "idle">("idle");

  const activeIndex = useSharedValue(0);
  const prevIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetX = event.contentOffset.x;
      const positiveOffsetX = Math.max(offsetX, 0);
      const positivePrevOffsetX = Math.max(prevOffsetX.get(), 0);

      activeIndex.set(Math.floor(offsetX / width + 0.5));

      if (
        positivePrevOffsetX - positiveOffsetX < 0 &&
        (scrollDirection.get() === "idle" || scrollDirection.get() === "to-left")
      ) {
        scrollDirection.set("to-right");
      }

      if (
        positivePrevOffsetX - positiveOffsetX > 0 &&
        (scrollDirection.get() === "idle" || scrollDirection.get() === "to-right")
      ) {
        scrollDirection.set("to-left");
      }

      prevOffsetX.set(offsetX);
    },
  });

  useAnimatedReaction(
    () => scrollDirection.get(),
    () => {
      prevIndex.set(activeIndex.get());
    }
  );

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
          <View className="mb-5 items-center justify-center h-8">
            <View className="absolute">
              <StaggeredText
                text="The easiest way to..."
                activeIndex={activeIndex}
                showIndex={[0, 1]}
              />
            </View>
            <View className="absolute">
              <StaggeredText text="And coming soon..." activeIndex={activeIndex} showIndex={[2]} />
            </View>
          </View>
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

// alma-onboarding-carousel-animation 🔼
