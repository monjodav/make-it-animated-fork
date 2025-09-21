import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Bell } from "lucide-react-native";
import React, { FC } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export const Home: FC = () => {
  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      className="flex-row items-center justify-between"
    >
      <Pressable className="flex-row items-center gap-2" onPress={simulatePress}>
        <View className="size-9 items-center justify-center rounded-lg bg-green-500">
          <Text className="text-black text-sm font-medium">MS</Text>
        </View>
        <Text className="font-semibold text-white">My Store</Text>
      </Pressable>
      <View className="flex-row items-center gap-4">
        <Pressable
          className="size-9 items-center justify-center rounded-full"
          onPress={simulatePress}
        >
          <Bell size={20} color="white" />
        </Pressable>
        <Pressable
          className="size-9 items-center justify-center rounded-full bg-fuchsia-600"
          onPress={simulatePress}
        >
          <Text className="text-white text-sm font-medium">VS</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};
