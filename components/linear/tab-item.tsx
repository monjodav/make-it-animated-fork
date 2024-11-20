import React, { FC } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { Tab } from "./tab-bar";

export type TabItemProps = {
  icon: React.ReactNode;
  label: string;
  value: Tab;
  isActive: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export const TabItem: FC<TabItemProps> = ({ icon, label, value, isActive, onPress, onLayout }) => {
  return (
    <Pressable
      className="flex-row items-center gap-1 px-3 py-2 border border-[#28282B] rounded-lg"
      style={styles.borderCurve}
      onLayout={onLayout}
      onPress={onPress}
    >
      <View className="w-4 h-4 items-center justify-center">{icon}</View>
      <Text className="text-linear-text font-medium">{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
