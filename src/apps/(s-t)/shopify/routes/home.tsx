import { FlatList, Platform, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Home = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <View
        className="p-5 bg-black"
        style={{ paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 50 }}
      >
        <Text className="text-2xl font-bold text-white">Home Screen</Text>
      </View>

      <View className="flex-1 rounded-tl-[20] rounded-tr-[20] overflow-hidden bg-white ">
        <FlatList
          data={[]}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={() => null}
          ListEmptyComponent={() => {
            return (
              <View className="flex-1">
                <View className="h-[300] mx-5 bg-gray-200 mt-5 rounded-[20]" />
                <View className="h-[50] mx-5 bg-gray-200 mt-4 rounded-[20]" />
                <View className="h-[50] mx-5 bg-gray-200 mt-4 rounded-[20]" />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};
