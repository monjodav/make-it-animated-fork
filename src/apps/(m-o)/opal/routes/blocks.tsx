import React, { FC } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AnimatedDashedBorder from "../components/animated-dashed-border";
import { Plus } from "lucide-react-native";
import Carousel from "../components/carousel/carousel";

export const Blocks: FC = () => {
  return (
    <ScrollView className="flex-1 bg-black" contentContainerClassName="px-5 pt-20">
      <View className="mb-4 w-16 h-5 rounded-full bg-neutral-900" />
      {/* opal-moving-dashed-border-animation 🔽 */}
      {/* Demo configuration:
          - strokeWidth 1.5 keeps the outline subtle on dark bg
          - dash/gap 5/4 yields a tight, premium cadence at this size
          - animationSpeed 2000ms = relaxed idle motion
          - radius 16 matches card rounding so dashes follow corner curvature */}
      <AnimatedDashedBorder
        strokeWidth={1.5}
        dashLength={5}
        gapLength={4}
        animationSpeed={2000}
        borderRadius={16}
        strokeColor={"#302D30"}
      >
        <View className="items-center justify-center py-5 bg-neutral-900/70 rounded-2xl">
          <View
            className="mb-3 p-3 rounded-[13px] border-neutral-700 border bg-neutral-800"
            style={styles.borderCurve}
          >
            <Plus size={20} color="#8D8B8D" strokeWidth={3} />
          </View>
          <Text className="text-neutral-400 font-medium text-lg">Limit App or Website</Text>
        </View>
      </AnimatedDashedBorder>
      {/* opal-moving-dashed-border-animation 🔼 */}
      <View className="mt-8 mb-4 w-16 h-5 rounded-full bg-neutral-900" />
      <View className="mb-4 h-[110px] rounded-2xl bg-neutral-900/70" style={styles.borderCurve} />
      <View className="mb-8 h-[110px] rounded-2xl bg-neutral-900/70" style={styles.borderCurve} />
      <View className="-mx-5">
        <Carousel />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
