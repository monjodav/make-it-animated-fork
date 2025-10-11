import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import React, { ReactNode } from "react";
import Animated, { EntryOrExitLayoutType, LinearTransition } from "react-native-reanimated";

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
      <Text className="text-neutral-50 text-2xl font-semibold text-center">{title}</Text>
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
