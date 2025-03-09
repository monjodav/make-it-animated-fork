import React, { FC } from "react";
import { View } from "react-native";

export const ChatListItem: FC = () => {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-16 w-16 rounded-full bg-neutral-900" />
      <View className="flex-1 gap-2">
        <View className="h-3 rounded-full w-1/2 bg-neutral-900" />
        <View className="h-2 rounded-full w-[80%] bg-neutral-900" />
        <View className="h-2 rounded-full w-[60%] bg-neutral-900" />
      </View>
    </View>
  );
};
