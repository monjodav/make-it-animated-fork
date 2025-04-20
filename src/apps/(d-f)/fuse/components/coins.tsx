import React, { FC } from "react";
import { View, ScrollView, Text } from "react-native";

export const Coins: FC = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="p-5">
      <View className="flex-row items-center">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-neutral-900" />
          <View className="flex-1">
            <Text className="text-neutral-900 text-base font-semibold">Solana</Text>
            <Text className="text-neutral-400 text-sm font-medium">SOL</Text>
          </View>
        </View>
        <Text className="text-neutral-900 text-base font-semibold">$0.00</Text>
      </View>
    </ScrollView>
  );
};
