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

// Search bar animation constants - define the collapse behavior
const _searchBarHeight = 36; // Fixed height of search bar component
const _searchBarMarginBottomMin = 8; // Minimum bottom margin when collapsed
const _searchBarMarginBottomMax = 24; // Maximum bottom margin when expanded

// Total margin change during animation (24px - 8px = 16px)
const _searchBarMarginBottomDistance = _searchBarMarginBottomMax - _searchBarMarginBottomMin;

// Total animation distance: height + margin delta (36px + 16px = 52px)
// This value is passed to LargeTitle to coordinate header title appearance timing
const _searchBarAnimationDistance = _searchBarHeight + _searchBarMarginBottomDistance;

export default function Chats() {
  // Measured height of entire header container for parallax calculations
  // Set once via onLayout to prevent unnecessary re-renders
  const [listHeaderHeight, setListHeaderHeight] = useState(0);

  // Shared scroll position drives all header animations (large title, search bar, header parallax)
  const offsetY = useSharedValue(0);

  // Worklet-optimized scroll handler runs on UI thread for 60fps animations
  // Single shared value coordinates all header component animations
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y; // Update shared value drives all dependent animations
    },
  });

  // Header parallax animation: creates sticky header effect with smooth transitions
  const rListHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // Complex 4-point interpolation for natural header behavior:
          // [-100, 0]: Pull-to-refresh bounce (scroll up 100px = header moves down 100px)
          // [0, _searchBarAnimationDistance]: Header stays fixed while search bar collapses
          // [_searchBarAnimationDistance, listHeaderHeight + _searchBarAnimationDistance]:
          //   Header slides up gradually until completely hidden
          // Final state: header translated up by its full height (-listHeaderHeight)
          translateY: interpolate(
            offsetY.value,
            [-100, 0, _searchBarAnimationDistance, listHeaderHeight + _searchBarAnimationDistance],
            [100, 0, 0, -listHeaderHeight], // Output: bounce down, stay, stay, slide up
            { extrapolateRight: "clamp" } // Prevent over-animation beyond defined range
          ),
        },
      ],
    };
  });

  return (
    <View className="flex-1 bg-black">
      <Animated.View
        style={rListHeaderStyle}
        className="absolute top-0 left-0 right-0 px-4" // Absolute positioning enables parallax translation
        onLayout={(e) => {
          // Measure header height once for parallax calculations
          // Prevents unnecessary re-renders by checking if already measured
          if (listHeaderHeight === 0) {
            setListHeaderHeight(e.nativeEvent.layout.height);
          }
        }}
      >
        <LargeTitle
          title="Chats"
          offsetY={offsetY} // Shared scroll position for coordinated animations
          searchBarAnimationDistance={_searchBarAnimationDistance} // Timing coordination with search bar
          className="mb-4 pt-4"
        />
        <SearchBar
          offsetY={offsetY} // Shared scroll position drives collapse animation
          height={_searchBarHeight} // Fixed height for consistent animation calculations
          marginBottomMin={_searchBarMarginBottomMin} // Collapsed state margin
          marginBottomMax={_searchBarMarginBottomMax} // Expanded state margin
        />
        <ChatsTopTabs />
      </Animated.View>
      <Animated.FlatList
        data={Array.from({ length: 20 }, (_, index) => index)}
        renderItem={({ item }) => <ChatListItem key={item} />}
        contentContainerClassName="p-4 gap-4"
        contentContainerStyle={{ paddingTop: listHeaderHeight + 16 }} // Prevent content overlap with header
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1000 / 60} // ~60fps scroll events for smooth animations
        onScroll={scrollHandler} // Worklet-optimized handler for UI thread performance
      />
    </View>
  );
}

// viber-chats-header-animation 🔼
