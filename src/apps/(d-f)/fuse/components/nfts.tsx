import { Image, Info } from "lucide-react-native";
import React, { FC } from "react";
import { View, ScrollView, Text } from "react-native";

export const NFTs: FC = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="p-5">
      <View className="flex-row gap-2 w-full p-4 bg-neutral-300 rounded-2xl mb-[150px]">
        <Info size={14} color="#737373" />
        <View className="flex-1">
          <Text className="text-neutral-500 text-xs">
            Fuse supports NFTs, pNFTs and some cNFT collections.
          </Text>
          <Text className="text-neutral-500 text-xs">Contact support for more information.</Text>
        </View>
      </View>
      <View className="items-center gap-5">
        <View className="w-14 h-14 rounded-full bg-neutral-300/75 items-center justify-center">
          <Image size={24} color="#a3a3a3" />
        </View>
        <Text className="text-neutral-400 text-2xl font-semibold">No NFTs yet</Text>
      </View>
    </ScrollView>
  );
};
