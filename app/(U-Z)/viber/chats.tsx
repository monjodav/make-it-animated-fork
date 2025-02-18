import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ChatListItem } from "@/components/U-Z/viber/chat-list-item";
import { LargeTitle } from "@/components/U-Z/viber/large-title";
import { SearchBar } from "@/components/U-Z/viber/search-bar";
import { ChatsTopTabs } from "@/components/U-Z/viber/chats-top-tabs";
import { View } from "react-native";

// viber-chats-header-animation 🔽

const _searchBarHeight = 36;
const _searchBarMarginBottomMin = 8;
const _searchBarMarginBottomMax = 24;

const _searchBarMarginBottomDistance = _searchBarMarginBottomMax - _searchBarMarginBottomMin;

const _searchBarAnimationDistance = _searchBarHeight + _searchBarMarginBottomDistance;

export default function Chats() {
  const offsetY = useSharedValue(0);

  const listHeaderHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y;
    },
  });

  const rListHeaderStyle = useAnimatedStyle(() => {
    if (!listHeaderHeight.value) return {};

    return {
      marginTop: interpolate(
        offsetY.value,
        [0, _searchBarAnimationDistance, listHeaderHeight.value],
        [0, 0, -listHeaderHeight.value],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(offsetY.value, [-100, 0], [100, 0], {
            extrapolateRight: "clamp",
          }),
        },
      ],
    };
  });

  const rListContainerStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(
        offsetY.value,
        [0, listHeaderHeight.value],
        [0, listHeaderHeight.value],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View className="flex-1 bg-black">
      <Animated.View
        className="px-4"
        style={rListHeaderStyle}
        onLayout={({ nativeEvent }) => listHeaderHeight.set(nativeEvent.layout.height)}
      >
        <LargeTitle
          title="Chats"
          offsetY={offsetY}
          searchBarAnimationDistance={_searchBarAnimationDistance - 16}
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
        style={rListContainerStyle}
        contentContainerClassName="p-4 gap-4"
        indicatorStyle="white"
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
}

// viber-chats-header-animation 🔼
