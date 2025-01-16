import { ChatListItem } from "@/components/viber/chat-list-item";
import { ScreenHeader } from "@/components/viber/screen-header";
import { _searchBarHeight, SearchBar } from "@/components/viber/search-bar";
import { Title } from "@/components/viber/title";
import { Camera, Plus, SquarePen } from "lucide-react-native";
import React from "react";
import { View, Text, Alert } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// viber-chats-header-animation 🔽

const _titleHeight = 36;
const _titleAndSearchBarSpacing = 16;

const scrollDistance = _titleHeight + _searchBarHeight + _titleAndSearchBarSpacing;

const _defaultListPaddingTop = 0;
const _finalListPaddingTop = _defaultListPaddingTop + scrollDistance;

export default function Chats() {
  const listOffsetY = useSharedValue(0);

  const isHeaderTitleVisible = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      listOffsetY.value = y;

      if (y > scrollDistance && !isHeaderTitleVisible.value) {
        isHeaderTitleVisible.value = true;
      } else if (y < scrollDistance && isHeaderTitleVisible.value) {
        isHeaderTitleVisible.value = false;
      }
    },
  });

  const rListStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(
        listOffsetY.value,
        [0, scrollDistance],
        [_defaultListPaddingTop, _finalListPaddingTop],
        Extrapolation.CLAMP
      ),
    };
  });

  const rTitleSearchBarSpacingStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        listOffsetY.value,
        [_searchBarHeight, _searchBarHeight + _titleAndSearchBarSpacing],
        [_titleAndSearchBarSpacing, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const _renderHeaderComponent = () => {
    return (
      <View className="flex-row items-center gap-2">
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
      <View className="px-5">
        <Title
          listOffsetY={listOffsetY}
          inputRange={[
            _searchBarHeight + _titleAndSearchBarSpacing,
            _searchBarHeight + _titleHeight + _titleAndSearchBarSpacing,
          ]}
        />
        <Animated.View className="h-4" style={rTitleSearchBarSpacingStyle} />
        <SearchBar listOffsetY={listOffsetY} />
      </View>
      <Animated.FlatList
        data={Array.from({ length: 20 }, (_, index) => index)}
        renderItem={({ item }) => <ChatListItem key={item} />}
        ListHeaderComponent={_renderHeaderComponent}
        style={rListStyle}
        contentContainerClassName="p-5 gap-4"
        indicatorStyle="white"
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
}

// viber-chats-header-animation 🔼
