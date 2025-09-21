import React, { FC } from "react";
import { FlatList, View, Text } from "react-native";
import { Search as SearchIcon } from "lucide-react-native";

// shopify-search-screen-top-tabs-animation 🔽

export const Search: FC = () => {
  const _renderListItem = ({ item }: { item: string }) => (
    <View key={item} className="items-center justify-center" />
  );

  return (
    <View className="flex-1 rounded-tl-[20] rounded-tr-[20] overflow-hidden bg-white ">
      <FlatList
        data={[]}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={_renderListItem}
        keyboardDismissMode="on-drag"
        ListEmptyComponent={() => {
          return (
            <View className="items-center mt-[90]">
              <SearchIcon size={30} color="#CCCCCC" strokeWidth={3} />
              <Text className="text-lg text-gray-700 mt-4">No recent searches</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

// shopify-search-screen-top-tabs-animation 🔼
