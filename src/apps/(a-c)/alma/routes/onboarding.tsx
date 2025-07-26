import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { View, StyleSheet, Text, Pressable, useWindowDimensions } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colorKit } from "reanimated-color-picker";

const HEADER_HEIGHT = 50;
const GRADIENT_HEIGHT = 50;

const data = Array.from({ length: 3 });

export const Onboarding: FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const listOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      listOffsetX.value = event.contentOffset.x;
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
        className="absolute bottom-0 left-0 right-0 h-[200px] bg-[#F7F5ED] px-8 pt-6"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <LinearGradient
          colors={[colorKit.setAlpha("#F7F5ED", 0).hex(), "#F7F5ED"]}
          style={styles.gradient}
        />
        <View className="items-center mb-4">
          <Text className="text-2xl font-semibold mb-4">The easiest way to...</Text>
          <View className="px-3 py-2 bg-white rounded-xl" style={styles.borderCurve}>
            <Text>Track what you eat</Text>
          </View>
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
