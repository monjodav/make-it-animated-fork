import React, { FC } from "react";
import { View, ScrollView } from "react-native";

export const NFTs: FC = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="p-5">
      <View className="w-full h-16 bg-neutral-300 rounded-2xl mb-[150px]" />
      <View className="items-center gap-5">
        <View className="w-16 h-16 rounded-full bg-neutral-300" />
        <View className="w-40 h-8 rounded-full bg-neutral-300" />
      </View>
    </ScrollView>
  );
};
