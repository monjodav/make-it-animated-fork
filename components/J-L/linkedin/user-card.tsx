import React, { FC } from "react";
import { View } from "react-native";

export const UserCard: FC = () => {
  return (
    <View className="flex-1 aspect-[0.75] rounded-xl border border-linkedin-front py-4">
      <View className="flex-1 items-center">
        <View className="w-1/2 aspect-square rounded-full bg-linkedin-front mb-4" />
        <View className="w-3/4 h-3 rounded-md bg-linkedin-front mb-1" />
        <View className="w-1/2 h-3 rounded-md bg-linkedin-front" />
      </View>
      <View className="self-center w-3/4 h-8 rounded-full border border-linkedin-front items-center justify-center">
        <View className="w-1/2 h-3 rounded-md bg-linkedin-front" />
      </View>
    </View>
  );
};
