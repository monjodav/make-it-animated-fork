import React, { FC } from "react";
import { LayoutChangeEvent, Pressable, Text } from "react-native";

export type TabItemProps = {
  label: string;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export const TabItem: FC<TabItemProps> = ({ label, onPress, onLayout }) => {
  return (
    <Pressable className="py-2" onLayout={onLayout} onPress={onPress}>
      <Text className="text-neutral-400 text-lg font-medium">{label}</Text>
    </Pressable>
  );
};
