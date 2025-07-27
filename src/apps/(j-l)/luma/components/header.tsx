import React, { FC } from "react";
import { View, Dimensions, Pressable, Text } from "react-native";
import { Map } from "lucide-react-native";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// luma-blurred-header-image-animation 🔽

// Full screen width for seamless header coverage
export const _headerWidth = Dimensions.get("window").width;
// 80% of screen height creates immersive header without overwhelming content
export const _headerHeight = Dimensions.get("window").height * 0.8;
// 30px offset prevents header overlap with status bar and enables pull-to-scale effect
export const _topOffset = 30;

export const Header: FC = () => {
  return (
    // Subtract topOffset to account for absolute positioned HeaderImage offset
    <View
      className="justify-end"
      style={{ width: _headerWidth, height: _headerHeight - _topOffset }}
    >
      <View className="p-4 pb-6">
        <View className="h-3 w-[120px] bg-white/25 rounded-full mb-2" />
        <View className="h-6 w-[100px] bg-white/25 rounded-full" />
        <View className="h-px w-full bg-white/10 my-5" />
        <View className="h-3 w-full bg-white/25 rounded-full mb-1" />
        <View className="h-3 w-[80%] bg-white/25 rounded-full mb-1" />
        <View className="h-3 w-[60%] bg-white/25 rounded-full mb-1" />
        <View className="h-3 w-[90%] bg-white/25 rounded-full mb-1" />
        <View className="h-3 w-[40%] bg-white/25 rounded-full mb-6" />
        <View className="flex-row items-center justify-between">
          <Pressable
            className="bg-white h-12 px-6 rounded-full items-center justify-center"
            onPress={simulatePress}
          >
            <Text className="text-center font-semibold text-lg text-purple-500">Subscribe</Text>
          </Pressable>
          <Pressable
            className="bg-white rounded-full h-12 w-12 items-center justify-center"
            onPress={simulatePress}
          >
            <Map size={20} color="gray" />
          </Pressable>
        </View>
      </View>
      <View className="h-6 w-full bg-black" />
    </View>
  );
};

// luma-blurred-header-image-animation 🔼
