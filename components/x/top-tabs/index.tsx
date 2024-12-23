import { useMeasureFlatListTabsLayout } from "@/hooks/use-measure-flat-list-tabs-layout";
import React, { FC, useRef, useState } from "react";
import { FlatList, View, ViewToken } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { TabIndicator } from "./tab-indicator";
import { TabItem } from "./tab-item";

// x-top-tabs-indicator-animation 🔽

const _sidePadding = 32;
const _gap = 55;

export enum Tab {
  ForYou = 0,
  Following = 1,
  NextJs = 2,
}

type Tabs = { label: string; value: Tab }[];

const tabs: Tabs = [
  {
    label: "For you",
    value: Tab.ForYou,
  },
  {
    label: "Following",
    value: Tab.Following,
  },
  {
    label: "Next.js",
    value: Tab.NextJs,
  },
];

export const TopTabs: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ForYou);
  const [viewableItems, setViewableItems] = useState<ViewToken[]>([]);

  const { tabWidths, tabOffsets } = useMeasureFlatListTabsLayout({
    tabsLength: tabs.length,
    sidePadding: _sidePadding,
    gap: _gap,
  });

  const ref = useRef<FlatList>(null);

  const offsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      offsetX.value = event.contentOffset.x;
    },
  });

  const _renderItem = ({ item, index }: { item: Tabs[number]; index: number }) => (
    <TabItem
      label={item.label}
      offsetX={offsetX}
      index={index}
      onPress={() => {
        setActiveTab(item.value);
        const isPrevItemVisible = viewableItems.some((item) => item.index === index - 1);
        const isCurrentItemVisible = viewableItems.some((item) => item.index === index);

        const viewPosition = isPrevItemVisible ? 1 : 0;
        const viewOffset = isPrevItemVisible ? -_sidePadding : _sidePadding;

        if (!isCurrentItemVisible) {
          ref.current?.scrollToIndex({ index, viewPosition, viewOffset });
        }
      }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        tabWidths.modify((value) => {
          "worklet";
          value[index] = width;
          return value;
        });
      }}
    />
  );

  return (
    <View>
      <TabIndicator
        activeTab={activeTab}
        tabBarOffsetX={offsetX}
        tabWidths={tabWidths}
        tabOffsets={tabOffsets}
      />
      <Animated.FlatList
        ref={ref}
        data={tabs}
        keyExtractor={(item) => item.value.toString()}
        renderItem={_renderItem}
        horizontal
        contentContainerStyle={{ paddingHorizontal: _sidePadding, gap: _gap }}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={1000 / 60}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
          minimumViewTime: 16,
        }}
        onViewableItemsChanged={({ viewableItems }) => {
          setViewableItems(viewableItems);
        }}
      />
    </View>
  );
};

// x-top-tabs-indicator-animation 🔼
