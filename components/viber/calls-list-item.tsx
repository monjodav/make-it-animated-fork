import React, { FC } from "react";
import { View } from "react-native";

export const CallsListItem: FC = () => {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-3">
        <View className="h-11 w-11 rounded-full bg-neutral-900" />
        <View className="flex-1 gap-2">
          <View className="h-3 rounded-full w-1/3 bg-neutral-900" />
          <View className="h-2 rounded-full w-1/2 bg-neutral-900" />
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="h-7 w-7 rounded-full bg-neutral-900" />
        <View className="h-7 w-7 rounded-full bg-neutral-900" />
      </View>
    </View>
  );
};
