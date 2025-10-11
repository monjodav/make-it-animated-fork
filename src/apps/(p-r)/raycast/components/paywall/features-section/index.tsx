import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import React, { ReactNode } from "react";
import Animated, { EntryOrExitLayoutType, LinearTransition } from "react-native-reanimated";
import { GradientText } from "@/src/shared/components/gradient-text";

interface FeaturesSectionProps {
  title: string;
  children: ReactNode;
  entering?: EntryOrExitLayoutType;
  exiting?: EntryOrExitLayoutType;
}

export const FeaturesSection = ({ title, children, entering, exiting }: FeaturesSectionProps) => {
  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      layout={LinearTransition.springify().damping(85).stiffness(1000)}
      style={{ transformOrigin: "bottom" }}
    >
      <GradientText
        text={title}
        className="text-2xl font-semibold text-center"
        gradientProps={{ colors: ["#a3a3a390", "#fafafa", "#a3a3a390"] }}
      />
      <View
        className="flex-1 bg-neutral-700/40 border border-neutral-700/10 rounded-3xl mt-5 p-4 overflow-hidden"
        style={styles.container}
      >
        <BlurView tint="systemThickMaterialDark" style={StyleSheet.absoluteFill} />
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
});

export { FeatureItem } from "./feature-item";
export { Divider } from "./divider";
