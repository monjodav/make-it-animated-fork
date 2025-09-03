import React, { FC, useRef, useState } from "react";
import { FlatList, TextInput, View, StyleSheet, Text, Pressable, Platform } from "react-native";
import { X, ScanBarcode, ListFilter, CircleX, Search as SearchIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// shopify-search-screen-animation 🔽

/**
 * Filter tabs drive the scrollable horizontal animation of categories.
 * "All filters" is treated as an action button for filter modal rather than a category.
 */

const FILTERS = ["All", "Orders", "Products", "Customers", "All filters"];

export const Search: FC = () => {
  const insets = useSafeAreaInsets();

  const [textInputValue, setTextInputValue] = useState<string>("");
  const [activeFilterItem, setActiveFilterItem] = useState<string>("All");
  const [pressedItem, setPressedItem] = useState<string | null>(null);

  // FlatList ref used for programmatic horizontal scroll when filters are selected
  const flatListRef = useRef<FlatList<string>>(null);

  const _renderItemFilter = ({ item, index }: { item: string; index: number }) => {
    const isActive = activeFilterItem === item;
    const isPressed = pressedItem === item;

    // These color states simulate "press in/out" and active highlighting.
    // Darker shade when active, mid-gray when pressed for tactile feedback.
    let containerStyle = "flex-row gap-2 items-center justify-center px-[16] py-[5] rounded-full";

    if (isPressed) {
      containerStyle += " bg-[#737373]";
    } else if (isActive) {
      containerStyle += " bg-[#303030]";
    }

    return (
      <Pressable
        key={item}
        onPressIn={() => setPressedItem(item)}
        onPressOut={() => setPressedItem(null)}
        onPress={() => {
          setActiveFilterItem(item);
          /**
           * Scroll-to-index centers the tapped filter ~45% across the screen.
           * This ensures visibility without snapping hard to edges.
           * "viewPosition: 0.45" is tuned to balance UX across iOS/Android.
           */
          flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.45 });
        }}
        className={containerStyle}
      >
        {item === "All filters" ? <ListFilter size={18} color={"#E3E3E3"} strokeWidth={2} /> : null}
        <Text className="text-lg text-[#E3E3E3]">{item}</Text>
      </Pressable>
    );
  };

  const _renderItemList = ({ item }: { item: string }) => (
    <View key={item} className="items-center justify-center"></View>
  );

  return (
    <View className="flex-1 bg-black">
      {/* Top bar uses safe-area insets to align correctly with iOS notch/Android status bar */}
      <View
        className="flex-row gap-3 items-center px-5 bg-black"
        style={{ paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 50 }}
      >
        <Pressable onPress={simulatePress} className="p-3 rounded-full bg-[#303030]">
          <X size={22} color="#E3E3E3" />
        </Pressable>

        {/* Search input container doubles as animated zone for clear/scan icons */}
        <View className="flex-1 rounded-2xl justify-center bg-[#303030]">
          <SearchIcon size={18} color="#B5B5B5" strokeWidth={2} style={styles.searchIcon} />
          <TextInput
            value={textInputValue}
            onChangeText={(text) => {
              setTextInputValue(text);
            }}
            placeholder={`Search`}
            placeholderTextColor="#B5B5B5"
            className="px-10 py-4 text-[#B5B5B5]"
            style={styles.input}
          />

          {textInputValue ? (
            // When text is present, fade-in "clear" icon for quick reset
            <Pressable
              onPress={() => {
                setTextInputValue("");
              }}
              style={styles.scanIcon}
            >
              <CircleX size={18} color="#B5B5B5" strokeWidth={2} />
            </Pressable>
          ) : (
            // Otherwise show scan icon; same layout slot, swapped visuals
            <Pressable style={styles.scanIcon}>
              <ScanBarcode size={18} color="#B5B5B5" strokeWidth={2} />
            </Pressable>
          )}
        </View>
      </View>

      <View>
        <FlatList
          ref={flatListRef}
          data={FILTERS}
          keyExtractor={(item) => item?.toString()}
          renderItem={_renderItemFilter}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-1 py-[13] mx-[15] bg-black"
        />
      </View>

      <View className="flex-1 rounded-tl-[20] rounded-tr-[20] overflow-hidden bg-white ">
        <FlatList
          data={[]}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={_renderItemList}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          ListEmptyComponent={() => {
            return (
              <View className="items-center mt-[90]">
                <SearchIcon size={30} color="#CCCCCC" strokeWidth={3} />
                <Text className="text-lg text-[#616161] mt-4">No recent searches</Text>
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
  input: {
    fontSize: 16,
  },
});

// shopify-search-screen-animation 🔼
