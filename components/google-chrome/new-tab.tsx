import React, { FC } from "react";
import { View } from "react-native";

export const NewTab: FC = () => {
  return (
    <View className="flex-1 items-center justify-center px-6 pb-20">
      <View className="absolute top-4 h-16 w-full rounded-xl bg-neutral-900 mb-8" />
      <View className="h-28 w-28 bg-neutral-900 rounded-full mb-8" />
      <View className="h-8 w-full bg-neutral-900 rounded-full mb-2" />
      <View className="h-6 w-5/6 bg-neutral-900 rounded-full" />
    </View>
  );
};
