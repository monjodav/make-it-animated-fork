import React, { FC } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useHeaderHeight } from "../lib/hooks/use-header-height";
import { useAnimatedScrollList } from "../lib/providers/animated-scroll-list-provider";
import { useBottomTabBarHeight } from "../lib/hooks/use-bottom-tab-bar-height";

// gmail-header-scroll-animation 🔽
// gmail-bottom-tab-bar-and-fab-animation 🔽

export const ContentList: FC = () => {
  const { headerHeight, searchBarHeight } = useHeaderHeight();
  const { grossHeight } = useBottomTabBarHeight();

  const { listRef, scrollHandler } = useAnimatedScrollList();

  return (
    <Animated.FlatList
      ref={listRef}
      data={Array.from({ length: 40 })}
      renderItem={() => (
        <View className="flex-row gap-6">
          <View className="w-12 h-12 rounded-full bg-neutral-800/50" />
          <View className="flex-1 gap-2">
            <View className="w-full h-3 rounded-md bg-neutral-800/50" />
            <View className="w-3/4 h-3 rounded-md bg-neutral-800/50" />
          </View>
          <View className="justify-between items-end">
            <View className="w-10 h-3 rounded-md bg-neutral-800/50" />
            <View className="w-4 h-4 rounded-md bg-neutral-800/50" />
          </View>
        </View>
      )}
      contentContainerClassName="gap-8 px-5"
      contentContainerStyle={{
        paddingTop: headerHeight + 28,
        paddingBottom: grossHeight + 16,
      }}
      onScroll={scrollHandler}
      scrollEventThrottle={1000 / 60}
      scrollIndicatorInsets={{ top: searchBarHeight }}
      indicatorStyle="white"
    />
  );
};

// gmail-bottom-tab-bar-and-fab-animation 🔼
// gmail-header-scroll-animation 🔼
