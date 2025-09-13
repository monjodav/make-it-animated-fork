import React, { FC, useRef, useState } from "react";
import { FlatList, TextInput, View, StyleSheet, Text, Pressable, Platform } from "react-native";
import { X, ScanBarcode, CircleX, Search as SearchIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import FilterItem from "../components/search-filter-item";
import { useSharedValue } from "react-native-reanimated";

// shopify-search-screen-top-tabs-animation 🔽

/**
 * FILTERS acts as the source of truth for the top tabs. Order matters because
 * FlatList uses the index for `scrollToIndex` centering math in `FilterItem` (viewPosition: 0.5).
 */
const FILTERS = ["All", "Orders", "Products", "Customers", "All filters"] as const;

export const Search: FC = () => {
  const insets = useSafeAreaInsets();

  const [textInputValue, setTextInputValue] = useState<string>("");
  const [activeFilterItem, setActiveFilterItem] = useState<string>("All");

  /**
   * SharedValue used by all tab items to reflect instantaneous press state
   * without triggering React re-renders. Using a shared value enables UI-thread
   * updates for press-in/press-out feedback at 60fps.
   */
  const pressedItem = useSharedValue<string | null>(null);

  /**
   * Ref used by tab items to programmatically center the active tab.
   * This allows each `FilterItem` to call `scrollToIndex({ viewPosition: 0.5 })`
   * so the selected tab is brought into focus.
   */
  const flatListRef = useRef<FlatList<string>>(null);

  const _renderListItem = ({ item }: { item: string }) => (
    <View key={item} className="items-center justify-center" />
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
            <Pressable
              onPress={() => {
                setTextInputValue("");
              }}
              style={styles.scanIcon}
            >
              <CircleX size={18} color="#B5B5B5" />
            </Pressable>
          ) : (
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
          /* Top tabs list. Keeping it horizontal and lightweight so `FilterItem`
           * can animate press feedback purely on the UI thread via shared values.
           * We avoid extra state here to reduce re-renders while flicking.
           */
          renderItem={({ item, index }) => (
            <FilterItem
              item={item}
              index={index}
              pressedItem={pressedItem}
              activeFilterItem={activeFilterItem}
              flatListRef={flatListRef}
              setActiveFilterItem={setActiveFilterItem}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-1 py-3 px-5 bg-black"
          keyboardShouldPersistTaps="handled"
        />
      </View>

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

// shopify-search-screen-top-tabs-animation 🔼
