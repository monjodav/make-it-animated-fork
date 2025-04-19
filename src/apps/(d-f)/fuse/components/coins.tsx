import React, { FC } from "react";
import { View, ScrollView } from "react-native";

export const Coins: FC = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="p-5">
      <View className="flex-row items-center">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-neutral-900" />
          <View className="flex-1 gap-1.5">
            <View className="w-16 h-4 rounded-full bg-neutral-300" />
            <View className="w-8 h-3 rounded-full bg-neutral-300" />
          </View>
        </View>
        <View className="w-8 h-3 rounded-full bg-neutral-300" />
      </View>
    </ScrollView>
  );
};
