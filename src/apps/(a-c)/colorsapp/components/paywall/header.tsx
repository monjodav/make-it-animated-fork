import React, { FC } from "react";

import { ArrowLeft, ArrowRight, Crown, MoreVertical } from "lucide-react-native";
import { TouchableOpacity, useWindowDimensions, View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AnimatedBackground from "./animated-background";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

type Props = {
  onUpgradeToProPress: () => void;
};

export const Header: FC<Props> = ({ onUpgradeToProPress }) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="rounded-b-[30px] bg-zinc-800"
      style={{
        height: height * 0.4,
      }}
    >
      <View className="absolute top-0 bottom-0 left-0 right-0 rounded-b-[30] overflow-hidden">
        {/* colorsapp-blurry-background-animation 🔽 */}
        <AnimatedBackground
          lightShadeColor="#E5E5E5"
          accentLightColor="#F8C2A9"
          primaryColor="#F9a8d4"
          accentDarkColor="#A5A8F9"
        />
        {/* colorsapp-blurry-background-animation 🔼 */}
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-800 opacity-40" />
      </View>
      <View className="flex-1 px-4 pb-6" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={simulatePress}
            className="w-12 h-12 rounded-full items-center justify-center bg-gray-200"
          >
            <ArrowLeft size={30} className="text-zinc-800" strokeWidth={1.5} />
          </Pressable>
          <Pressable
            onPress={simulatePress}
            className="w-12 h-12 rounded-full items-center justify-center bg-gray-200"
          >
            <MoreVertical size={24} className="text-zinc-800" strokeWidth={1.5} />
          </Pressable>
        </View>
        <View className="flex-1 justify-center">
          <Text className="font-semibold text-gray-200 text-2xl mb-1">Welcome 🎉</Text>
          <Text className="text-gray-300 text-lg">Your current user status is explorer.</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onUpgradeToProPress}
              className="flex-row items-center mr-1"
            >
              <Crown size={16} color="#f472b6" />
              <Text className="text-pink-400 text-lg font-bold mt-[2px] ml-1">Upgrade to PRO</Text>
            </TouchableOpacity>
            <Text className="text-gray-300 text-lg">to unlock all features.</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          className="px-6 py-3 bg-zinc-500/40 rounded-full items-center justify-between flex-row"
          onPress={simulatePress}
        >
          <Text className="text-gray-200 text-lg font-semibold">🎨 Saved palettes</Text>
          <ArrowRight size={30} color="#e5e7eb" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
