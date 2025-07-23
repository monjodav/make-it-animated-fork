import React, { FC } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { Tab } from "./tab-bar";

// linear-button-tabs-indicator-animation 🔽

// Shared styling constants exported for TabIndicator visual consistency
export const _borderRadius = 8; // Rounded corners for modern button appearance
export const _borderColor = "#28282B"; // Dark gray border matching Linear's design system
export const _borderCurve = "continuous"; // iOS 16+ continuous curves for premium feel

export type TabItemProps = {
  icon: React.ReactNode;
  label: string;
  value: Tab;
  isActive: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export const TabItem: FC<TabItemProps> = ({ icon, label, onPress, onLayout }) => {
  return (
    <Pressable
      className="flex-row items-center gap-1 px-3 py-2 border"
      style={styles.container}
      onLayout={onLayout} // Measures actual rendered width for indicator calculations
      onPress={onPress} // Triggers activeTab state change and scroll positioning
    >
      {/* Fixed icon container ensures consistent spacing regardless of icon complexity */}
      <View className="w-4 h-4 items-center justify-center">{icon}</View>
      <Text className="text-linear-text font-medium">{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: _borderRadius, // Matches TabIndicator for seamless visual integration
    borderColor: _borderColor, // Creates subtle outline defining tab boundaries
    borderCurve: _borderCurve, // Platform-specific enhancement for iOS premium feel
  },
});

// linear-button-tabs-indicator-animation 🔼
