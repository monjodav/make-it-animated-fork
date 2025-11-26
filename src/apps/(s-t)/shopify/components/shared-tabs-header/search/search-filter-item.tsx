import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ListFilter } from "lucide-react-native";
import type { RefObject } from "react";
import type { FlatList } from "react-native";

// shopify-search-screen-top-tabs-animation 🔽

type FilterItemProps = {
  item: string;
  index: number;
  activeFilterItem: string | null;
  flatListRef: RefObject<FlatList<string> | null>;
  setActiveFilterItem: (item: string) => void;
};

const FilterItem = ({
  item,
  index,
  activeFilterItem,
  flatListRef,
  setActiveFilterItem,
}: FilterItemProps) => {
  const isActive = activeFilterItem === item;

  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => {
        setPressed(true);
      }}
      onPressOut={() => {
        setPressed(false);
      }}
      onPress={() => {
        setActiveFilterItem(item);
        // Center the selected tab in view for better discoverability (viewPosition: 0.5)
        flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      }}
    >
      <View
        className="flex-row gap-2 items-center justify-center px-4 py-1 rounded-full"
        style={{ backgroundColor: pressed ? "#737373" : !isActive ? "transparent" : "#303030" }}
      >
        {item === "All filters" ? <ListFilter size={18} color={"#E5E7EB"} /> : null}
        <Text className="text-lg text-gray-200 ">{item}</Text>
      </View>
    </Pressable>
  );
};

export default FilterItem;

// shopify-search-screen-top-tabs-animation 🔼
