import React, { FC } from "react";
import { View } from "react-native";

export const JobItem: FC = () => {
  return (
    <View className="flex-row items-center px-4 gap-4">
      <View className="w-16 h-16 rounded-md bg-linkedin-front" />
      <View className="flex-1 gap-2">
        <View className="w-[70%] h-3 rounded-md bg-linkedin-front" />
        <View className="w-[50%] h-3 rounded-md bg-linkedin-front" />
      </View>
    </View>
  );
};
