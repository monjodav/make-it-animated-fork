import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BlurView } from "expo-blur";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HomeHeader: FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="bg-x-back/50 px-5 pb-5 border-b border-x-front"
      style={{ paddingTop: insets.top + 8 }}
    >
      {/* BlurView is experimental on Android and should be used with caution */}
      {/* To apply blur effect on Android, you need use experimentalBlurMethod prop */}
      <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View className="flex-row items-end justify-between">
        <View className="w-8 h-8 bg-x-front rounded-full" />
        <View className="absolute w-full h-full flex-row items-center justify-center pointer-events-none">
          <FontAwesome6 name="x-twitter" size={24} color="white" />
        </View>
        <View className="w-[60px] h-8 bg-x-front rounded-full" />
      </View>
    </View>
  );
};
