import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ChatListItem } from "@/components/viber/chat-list-item";
import { useHeaderHeight } from "@react-navigation/elements";
import { LargeTitle } from "@/components/viber/large-title";
import { SearchBar } from "@/components/viber/search-bar";
import { ChatsTopTabs } from "@/components/viber/chats-top-tabs";
import { View } from "react-native";

// viber-chats-header-animation 🔽

const _searchBarHeight = 36;
const _searchBarMarginBottomMin = 8;
const _searchBarMarginBottomMax = 24;

const _searchBarMarginBottomDistance = _searchBarMarginBottomMax - _searchBarMarginBottomMin;

const _searchBarAnimationDistance = _searchBarHeight + _searchBarMarginBottomDistance;

export default function Chats() {
  const headerHeight = useHeaderHeight();
  const listPaddingTop = headerHeight + 16;

  const offsetY = useSharedValue(0);

  const listHeaderHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y;
    },
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(
        offsetY.value,
        [0, _searchBarAnimationDistance],
        [0, _searchBarAnimationDistance],
        Extrapolation.CLAMP
      ),
    };
  });

  const _renderHeader = () => {
    return (
      <View onLayout={({ nativeEvent }) => listHeaderHeight.set(nativeEvent.layout.height)}>
        <LargeTitle
          title="Chats"
          offsetY={offsetY}
          searchBarAnimationDistance={_searchBarAnimationDistance}
          className="mb-4"
        />
        <SearchBar
          offsetY={offsetY}
          height={_searchBarHeight}
          marginBottomMin={_searchBarMarginBottomMin}
          marginBottomMax={_searchBarMarginBottomMax}
        />
        <ChatsTopTabs />
      </View>
    );
  };

  return (
    <Animated.FlatList
      data={Array.from({ length: 20 }, (_, index) => index)}
      renderItem={({ item }) => <ChatListItem key={item} />}
      ListHeaderComponent={_renderHeader}
      className="bg-black"
      style={rContainerStyle}
      contentContainerClassName="px-5 pb-5 gap-4"
      contentContainerStyle={{ paddingTop: listPaddingTop }}
      indicatorStyle="white"
      scrollIndicatorInsets={{ top: 200 }}
      scrollEventThrottle={1000 / 60}
      onScroll={scrollHandler}
    />
  );
}

// viber-chats-header-animation 🔼
