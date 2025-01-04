import React, { FC } from "react";
import { View, Dimensions, Pressable, Alert, Text } from "react-native";
import { Map } from "lucide-react-native";

export const _headerWidth = Dimensions.get("window").width;
export const _headerHeight = Dimensions.get("window").height * 0.8;
export const _topOffset = 40;

export const Header: FC = () => {
  return (
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
            onPress={() => Alert.alert("Subscribe")}
          >
            <Text className="text-center font-semibold text-lg text-purple-500">Subscribe</Text>
          </Pressable>
          <Pressable
            className="bg-white rounded-full h-12 w-12 items-center justify-center"
            onPress={() => Alert.alert("Map")}
          >
            <Map size={20} color="gray" />
          </Pressable>
        </View>
      </View>
      <View className="h-6 w-full bg-black" />
    </View>
  );
};
