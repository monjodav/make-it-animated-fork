import React, { FC, useRef } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Coins } from "../components/coins";
import { NFTs } from "../components/nfts";
import { Dashboard } from "../components/dashboard";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { HomeListItemContainer } from "../components/home-list-item-container";
import { TopTabs } from "../components/top-tabs";
import { Tab, TabValue } from "../lib/types";
import { useAndroidNote } from "@/src/shared/lib/hooks/use-android-note";

// fuse-home-tabs-transition-animation 🔽

const tabs: Tab[] = [
  { label: "Dashboard", value: TabValue.Dashboard, content: <Dashboard /> },
  { label: "Coins", value: TabValue.Coins, content: <Coins /> },
  { label: "NFTs", value: TabValue.NFTs, content: <NFTs /> },
];

export const Home: FC = () => {
  // Android shows a simplified transition (no complex blur/layering) for smoother perf.
  // iOS retains richer motion/blur until an Android-optimized path is found.
  useAndroidNote(
    "Performance of tabs transition animation is not optimal. There is a safe fallback for android platform until I found a better solution."
  );

  const horizontalListRef = useRef<FlatList>(null);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Shared values used across TopTabs, TabIndicator and item containers.
  // They coordinate cross-fade/slide (content) and underline (tabs) in sync.
  const horizontalListOffsetX = useSharedValue(0);
  const isHorizontalListScrollingX = useSharedValue(false);
  const prevActiveTabIndex = useSharedValue(0);
  const activeTabIndex = useSharedValue(0);

  // Single scroll handler keeps all animations on UI thread.
  // onBeginDrag toggles a live-follow mode for the indicator; onMomentumEnd snaps state.
  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isHorizontalListScrollingX.set(true);
    },
    onScroll: (event) => {
      horizontalListOffsetX.set(event.contentOffset.x);
    },
    onMomentumEnd: (event) => {
      isHorizontalListScrollingX.set(false);
      activeTabIndex.set(Math.round(event.contentOffset.x / width));
    },
  });

  const _renderItem = ({ item, index }: { item: Tab; index: number }) => {
    return (
      <HomeListItemContainer
        index={index}
        activeTabIndex={activeTabIndex}
        prevActiveTabIndex={prevActiveTabIndex}
        horizontalListOffsetX={horizontalListOffsetX}
        isHorizontalListScrollingX={isHorizontalListScrollingX}
      >
        {item.content}
      </HomeListItemContainer>
    );
  };

  return (
    <View className="flex-1 bg-neutral-200" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center px-7 mb-4">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-neutral-300" />
          <View className="gap-1.5">
            <View className="w-12 h-4 rounded-full bg-neutral-300" />
            <View className="w-20 h-3 rounded-full bg-neutral-300" />
          </View>
        </View>
        <View className="w-6 h-6 rounded-full border-[2px] border-neutral-300" />
      </View>
      <TopTabs
        tabs={tabs}
        horizontalListRef={horizontalListRef}
        horizontalListOffsetX={horizontalListOffsetX}
        isHorizontalListScrollingX={isHorizontalListScrollingX}
        activeTabIndex={activeTabIndex}
        prevActiveTabIndex={prevActiveTabIndex}
      />
      <View className="flex-1">
        <Animated.FlatList
          ref={horizontalListRef}
          data={tabs}
          renderItem={_renderItem}
          keyExtractor={(item) => item.value.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          onScroll={scrollHandler}
          // 16ms (~60fps) ensures smooth interpolation updates during drag.
          scrollEventThrottle={16}
          // Disable bounce to keep interpolation bounds stable at page edges.
          bounces={false}
        />
      </View>
    </View>
  );
};

// fuse-home-tabs-transition-animation 🔼
