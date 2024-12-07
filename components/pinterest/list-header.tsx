import React, { FC } from "react";
import { View } from "react-native";

export const ListHeader: FC = () => {
  return (
    <View className="flex-row items-center gap-3 px-5 pb-4 pt-2">
      <View className="w-12 h-12 rounded-xl bg-neutral-900" />
      <View className="flex-1 gap-1">
        <View className="h-4 w-[30%] rounded-full bg-neutral-900" />
        <View className="h-3 w-[15%] rounded-full bg-neutral-900" />
      </View>
    </View>
  );
};
