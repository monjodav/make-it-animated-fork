import React, { FC, useRef, useState } from "react";
import { FlatList, TextInput, View, StyleSheet, Text, Pressable, Platform } from "react-native";
import { X, ScanBarcode, CircleX, Search as SearchIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import FilterItem from "../components/search-filter-item";

// shopify-search-screen-animation 🔽

/**
 * Filter tabs drive the scrollable horizontal animation of categories.
 * "All filters" is treated as an action button for filter modal rather than a category.
 */

const FILTERS = ["All", "Orders", "Products", "Customers", "All filters"] as const;

export const Search: FC = () => {
  const insets = useSafeAreaInsets();

  const [textInputValue, setTextInputValue] = useState<string>("");
  const [activeFilterItem, setActiveFilterItem] = useState<string>("All");
  const [pressedItem, setPressedItem] = useState<string | null>(null);

  // FlatList ref used for programmatic horizontal scroll when filters are selected
  const flatListRef = useRef<FlatList<string>>(null);

  const _renderListItem = ({ item }: { item: string }) => (
    <View key={item} className="items-center justify-center"></View>
  );

  return (
    <View className="flex-1 bg-black">
      <View
        className="flex-row gap-3 items-center px-5 bg-black"
        style={{ paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 50 }}
      >
        <Pressable onPress={simulatePress} className="p-3 rounded-full bg-[#303030]">
          <X size={22} color="#E5E7EB" />
        </Pressable>

        <View className="flex-1 rounded-2xl justify-center bg-[#303030]">
          <SearchIcon size={18} color="#B5B5B5" style={styles.searchIcon} />
          <TextInput
            value={textInputValue}
            onChangeText={setTextInputValue}
            placeholder="Search"
            placeholderTextColor="#B5B5B5"
            className="px-10 py-4 text-base text-[#B5B5B5]"
          />

          {textInputValue ? (
            // When text is present, fade-in "clear" icon for quick reset
            <Pressable
              onPress={() => {
                setTextInputValue("");
              }}
              style={styles.scanIcon}
            >
              <CircleX size={18} color="#B5B5B5" />
            </Pressable>
          ) : (
            // Otherwise show scan icon; same layout slot, swapped visuals
            <Pressable style={styles.scanIcon}>
              <ScanBarcode size={18} color="#B5B5B5" />
            </Pressable>
          )}
        </View>
      </View>

      <View>
        <FlatList
          ref={flatListRef}
          data={FILTERS}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item, index }) => (
            <FilterItem
              item={item}
              index={index}
              pressedItem={pressedItem}
              activeFilterItem={activeFilterItem}
              flatListRef={flatListRef}
              setPressedItem={setPressedItem}
              setActiveFilterItem={setActiveFilterItem}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-1 py-3 px-5 bg-black"
        />
      </View>

      <View className="flex-1 rounded-tl-[20] rounded-tr-[20] overflow-hidden bg-white ">
        <FlatList
          data={[]}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={_renderListItem}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
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
    </View>
  );
};

const styles = StyleSheet.create({
  searchIcon: {
    position: "absolute",
    left: 11,
  },
  scanIcon: {
    position: "absolute",
    right: 13,
  },
});

// shopify-search-screen-animation 🔼
