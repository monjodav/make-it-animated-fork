import React, { FC } from "react";
import { View } from "react-native";

export const EventItem: FC = () => {
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-[80px] h-[80px] bg-neutral-900 rounded-xl" />
      <View className="flex-1 gap-1">
        <View className="h-3 w-[80px] bg-neutral-900 rounded-full" />
        <View className="h-4 w-full bg-neutral-900 rounded-full" />
        <View className="h-4 w-full bg-neutral-900 rounded-full" />
        <View className="h-3 w-[120px] bg-neutral-900 rounded-full" />
      </View>
    </View>
  );
};
