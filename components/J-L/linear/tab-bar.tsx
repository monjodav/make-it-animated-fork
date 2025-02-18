import { useMeasureFlatListTabsLayout } from "@/hooks/use-measure-flat-list-tabs-layout";
import { CircleDashed, CircleMinus, CirclePlay, Copy, Folders } from "lucide-react-native";
import React, { FC, useRef, useState } from "react";
import { FlatList, View, ViewToken } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { TabIndicator } from "./tab-indicator";
import { TabItem, TabItemProps } from "./tab-item";

// linear-button-tabs-indicator-animation 🔽

const _sidePadding = 16;
const _gap = 8;
const _iconColor = "#A1A1A4";
const _iconSize = 12;

export enum Tab {
  AllIssues = 0,
  Active = 1,
  Backlog = 2,
  Triage = 3,
  CurrentCycle = 4,
  UpcomingCycle = 5,
}

type Tabs = Pick<TabItemProps, "icon" | "label" | "value">[];

const tabs: Tabs = [
  {
    icon: <Folders size={_iconSize} color={_iconColor} />,
    label: "All Issues",
    value: Tab.AllIssues,
  },
  {
    icon: <Copy size={_iconSize} color={_iconColor} />,
    label: "Active",
    value: Tab.Active,
  },
  {
    icon: <CircleDashed size={_iconSize} color={_iconColor} />,
    label: "Backlog",
    value: Tab.Backlog,
  },
  {
    icon: <CircleMinus size={_iconSize} color={_iconColor} />,
    label: "Triage",
    value: Tab.Triage,
  },
  {
    icon: <CirclePlay size={_iconSize} color={_iconColor} />,
    label: "Current Cycle",
    value: Tab.CurrentCycle,
  },
  {
    icon: <CirclePlay size={_iconSize} color={_iconColor} />,
    label: "Upcoming Cycle",
    value: Tab.UpcomingCycle,
  },
];

export const TabBar: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.AllIssues);
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
      icon={item.icon}
      label={item.label}
      value={item.value}
      isActive={activeTab === item.value}
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

// linear-button-tabs-indicator-animation 🔼
