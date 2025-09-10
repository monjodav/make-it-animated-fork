import { FlatList, Platform, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Products = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <View
        className="px-5 py-5 bg-black"
        style={{ paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 50 }}
      >
        <Text className="text-2xl font-bold text-white">Products</Text>
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
                <View className="h-[20] w-4/5 bg-gray-200 mt-4 rounded-[20]" />
                <View className="h-[50] w-3/5 bg-gray-200 mt-10 rounded-[20]" />
                <View className="h-[10] w-1/5 bg-gray-200 mt-4 rounded-[20]" />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};
