import { Plus } from "lucide-react-native";
import React, { FC } from "react";
import { View, Text } from "react-native";

export const ChatsTopTabs: FC = () => {
  return (
    <View className="flex-row items-center gap-2">
      <View className="px-4 h-8 items-center justify-center rounded-full bg-neutral-900 border border-[#7F61F2]/50">
        <Text className="text-neutral-300 text-sm">All</Text>
      </View>
      <View className="px-4 h-8 items-center justify-center rounded-full bg-neutral-900">
        <Text className="text-neutral-300 text-sm">
          <Text className="text-xs">⭐</Text> Favorites
        </Text>
      </View>
      <View className="w-8 h-8 items-center justify-center rounded-full bg-neutral-900">
        <Plus size={14} color="#7F61F280" />
      </View>
    </View>
  );
};
