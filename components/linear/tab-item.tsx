import React, { FC } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Tab } from "./tab-bar";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const _duration = 300;

export type TabItemProps = {
  icon: React.ReactNode;
  label: string;
  value: Tab;
  isActive: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export const TabItem: FC<TabItemProps> = ({ icon, label, value, isActive, onPress, onLayout }) => {
  const rPressableStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(isActive ? "transparent" : "#28282B", { duration: _duration }),
    };
  });

  return (
    <AnimatedPressable
      className="flex-row items-center gap-1 px-3 py-2 border rounded-lg"
      style={rPressableStyle}
      onLayout={onLayout}
      onPress={onPress}
    >
      <View className="w-4 h-4 items-center justify-center">{icon}</View>
      <Text className="text-linear-text font-medium">{label}</Text>
    </AnimatedPressable>
  );
};
