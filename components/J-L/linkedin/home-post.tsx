import React, { FC } from "react";
import { View } from "react-native";

export const HomePost: FC = () => {
  return (
    <View className="bg-linkedin-back w-full py-4">
      <View className="flex-row items-center px-4 gap-4 mb-4">
        <View className="w-16 h-16 rounded-md bg-linkedin-front" />
        <View className="flex-1 gap-2">
          <View className="w-40 h-3 rounded-md bg-linkedin-front" />
          <View className="w-32 h-3 rounded-md bg-linkedin-front" />
        </View>
      </View>
      <View className="px-4 gap-2 mb-4">
        <View className="w-full h-3 rounded-md bg-linkedin-front" />
        <View className="w-5/6 h-3 rounded-md bg-linkedin-front" />
      </View>
      <View className="w-full aspect-square bg-linkedin-front mb-6" />
      <View className="px-8 flex-row justify-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <View className="gap-2 items-center" key={index}>
            <View className="w-4 h-4 rounded-md bg-linkedin-front" />
            <View className="w-8 h-2 rounded-full bg-linkedin-front" />
          </View>
        ))}
      </View>
    </View>
  );
};
