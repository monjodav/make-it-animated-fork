import { ChatListItem } from "@/components/viber/chat-list-item";
import { ScreenHeader } from "@/components/viber/screen-header";
import { _searchBarHeight, SearchBar } from "@/components/viber/search-bar";
import { Camera, Plus, SquarePen } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const _defaultPaddingTop = 0;
const _contentPadding = 20;
const _gap = 16;

export default function Chats() {
  const [scrollIndicatorInsetTop, setScrollIndicatorInsetTop] = useState(0);

  const listOffsetY = useSharedValue(0);
  const titlePlusSearchBarHeight = useSharedValue(0);
  const isHeaderTitleVisible = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      listOffsetY.value = y;

      const dist = titlePlusSearchBarHeight.value + _contentPadding;

      if (y > dist && !isHeaderTitleVisible.value) {
        isHeaderTitleVisible.value = true;
      } else if (y < dist && isHeaderTitleVisible.value) {
        isHeaderTitleVisible.value = false;
      }
    },
  });

  const rListStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(
        listOffsetY.value,
        [0, _searchBarHeight],
        [_defaultPaddingTop, _defaultPaddingTop + _searchBarHeight],
        Extrapolation.CLAMP
      ),
    };
  });

  const _renderListHeader = () => {
    return (
      <View onLayout={({ nativeEvent }) => setScrollIndicatorInsetTop(nativeEvent.layout.height)}>
        <View
          onLayout={({ nativeEvent }) => {
            titlePlusSearchBarHeight.value = nativeEvent.layout.height;
          }}
        >
          <Text className="text-3xl text-neutral-300 font-bold mb-4">Chats</Text>
          <SearchBar listOffsetY={listOffsetY} />
        </View>
        <View className="flex-row items-center gap-2 mt-6">
          <View className="px-4 h-8 items-center justify-center rounded-full bg-neutral-900 border border-[#7F61F2]/50">
            <Text className="text-neutral-300 text-sm">All</Text>
          </View>
          <View className="px-4 h-8 items-center justify-center rounded-full bg-neutral-900">
            <Text className="text-neutral-300 text-sm">
              <Text className="text-xs">⭐</Text> Favorites
            </Text>
          </View>
          <View className="w-8 h-8 items-center justify-center rounded-full bg-neutral-900">
            <Plus size={14} color="#7F61F280" />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <ScreenHeader
        title="Chats"
        rightIcon1={<Camera size={20} color="#7F61F2" />}
        onRightButton1Press={() => Alert.alert("Take a photo")}
        rightIcon2={<SquarePen size={18} color="#7F61F2" />}
        onRightButton2Press={() => Alert.alert("Create a chat")}
        isHeaderTitleVisible={isHeaderTitleVisible}
      />
      <Animated.FlatList
        data={Array.from({ length: 20 }, (_, index) => index)}
        renderItem={({ item }) => <ChatListItem key={item} />}
        style={rListStyle}
        contentContainerStyle={styles.contentContainerStyle}
        ListHeaderComponent={_renderListHeader}
        indicatorStyle="white"
        scrollIndicatorInsets={{ top: scrollIndicatorInsetTop + 2 * _gap }}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: _contentPadding,
    gap: _gap,
  },
});
