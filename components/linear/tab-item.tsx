import React, { FC } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { Tab } from "./tab-bar";

export const _borderRadius = 8;
export const _borderColor = "#28282B";
export const _borderCurve = "continuous";

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
      className="flex-row items-center gap-1 px-3 py-2 border"
      style={styles.container}
      onLayout={onLayout}
      onPress={onPress}
    >
      <View className="w-4 h-4 items-center justify-center">{icon}</View>
      <Text className="text-linear-text font-medium">{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: _borderRadius,
    borderColor: _borderColor,
    borderCurve: _borderCurve,
  },
});
