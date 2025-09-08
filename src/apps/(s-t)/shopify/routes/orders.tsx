import { FlatList, Platform, Text, View } from "react-native";
import React from "react";
import Animated, { interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMenu } from "../lib/providers/menu-provider";

export const Orders = () => {
  const insets = useSafeAreaInsets();
  const { menuProgress } = useMenu();

  const rContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(interpolate(menuProgress.get(), [0, 1], [1, 0]), { duration: 300 });

    return {
      opacity,
      transform: [
        {
          translateY: withTiming(menuProgress.get() === 1 ? 50 : 0, { duration: 300 }),
        },
      ],
    };
  });

  return (
    <Animated.View className="flex-1 bg-black" style={rContainerStyle}>
      <View
        className="px-5 py-5 bg-black"
        style={{ paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 50 }}
      >
        <Text className="text-2xl font-bold text-white">Orders</Text>
      </View>

      <View className="flex-1 rounded-tl-[20] rounded-tr-[20] overflow-hidden bg-white ">
        <FlatList
          data={[]}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={() => null}
          ListEmptyComponent={() => {
            return (
              <View className="flex-1 items-center">
                <View className="h-[100] w-[100] bg-gray-200 mt-20 rounded-full" />
                <View className="h-[20] w-4/5 bg-gray-200 mt-20 rounded-[20]" />
                <View className="h-[20] w-4/5 bg-gray-200 mt-4 rounded-[20]" />
                <View className="h-[20] w-4/5 bg-gray-200 mt-4 rounded-[20]" />
                <View className="h-[50] w-3/5 bg-gray-200 mt-10 rounded-[20]" />
              </View>
            );
          }}
        />
      </View>
    </Animated.View>
  );
};
