import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { FC } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TopTabs } from "./top-tabs";

export const HomeHeader: FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="bg-x-back/50 px-5 border-b border-x-front"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-end justify-between mb-2">
        <View className="w-8 h-8 bg-x-front rounded-full" />
        <View className="absolute w-full h-full flex-row items-center justify-center pointer-events-none">
          <FontAwesome6 name="x-twitter" size={24} color="#e5e5e5" />
        </View>
        <View className="w-[60px] h-8 bg-x-front rounded-full" />
      </View>
      <TopTabs />
    </View>
  );
};
