import React, { useState } from "react";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ChatListItem } from "../components/chat-list-item";
import { LargeTitle } from "../components/large-title";
import { SearchBar } from "../components/search-bar";
import { ChatsTopTabs } from "../components/chats-top-tabs";
import { View } from "react-native";

// viber-chats-header-animation 🔽

const _searchBarHeight = 36;
const _searchBarMarginBottomMin = 8;
const _searchBarMarginBottomMax = 24;

const _searchBarMarginBottomDistance = _searchBarMarginBottomMax - _searchBarMarginBottomMin;

const _searchBarAnimationDistance = _searchBarHeight + _searchBarMarginBottomDistance;

export default function Chats() {
  const [listHeaderHeight, setListHeaderHeight] = useState(0);

  const offsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y;
    },
  });

  const rListHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            offsetY.value,
            [-100, 0, _searchBarAnimationDistance, listHeaderHeight + _searchBarAnimationDistance],
            [100, 0, 0, -listHeaderHeight],
            { extrapolateRight: "clamp" }
          ),
        },
      ],
    };
  });

  return (
    <View className="flex-1 bg-black">
      <Animated.View
        style={rListHeaderStyle}
        className="absolute top-0 left-0 right-0 px-4"
        onLayout={(e) => {
          if (listHeaderHeight === 0) {
            setListHeaderHeight(e.nativeEvent.layout.height);
          }
        }}
      >
        <LargeTitle
          title="Chats"
          offsetY={offsetY}
          searchBarAnimationDistance={_searchBarAnimationDistance}
          className="mb-4 pt-4"
        />
        <SearchBar
          offsetY={offsetY}
          height={_searchBarHeight}
          marginBottomMin={_searchBarMarginBottomMin}
          marginBottomMax={_searchBarMarginBottomMax}
        />
        <ChatsTopTabs />
      </Animated.View>
      <Animated.FlatList
        data={Array.from({ length: 20 }, (_, index) => index)}
        renderItem={({ item }) => <ChatListItem key={item} />}
        contentContainerClassName="p-4 gap-4"
        contentContainerStyle={{ paddingTop: listHeaderHeight + 16 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
}

// viber-chats-header-animation 🔼
