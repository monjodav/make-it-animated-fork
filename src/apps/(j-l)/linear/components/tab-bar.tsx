import { useMeasureFlatListTabsLayout } from "@/src/shared/lib/hooks/use-measure-flat-list-tabs-layout";
import { CircleDashed, CircleMinus, CirclePlay, Copy, Folders } from "lucide-react-native";
import React, { FC, useRef, useState } from "react";
import { FlatList, View, ViewToken } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { TabIndicator } from "./tab-indicator";
import { TabItem, TabItemProps } from "./tab-item";

// linear-button-tabs-indicator-animation 🔽

// Layout constants for tab bar spacing and visual consistency
const _sidePadding = 16; // Horizontal padding from screen edges, used in scroll positioning calculations
const _gap = 8; // Space between tab items, affects indicator positioning math
const _iconColor = "#A1A1A4"; // Muted gray for subtle icon presence
const _iconSize = 12; // Compact icon size maintains button proportions

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

  // Dynamic layout measurements for responsive indicator positioning
  // tabWidths: array of actual rendered tab widths for precise indicator sizing
  // tabOffsets: cumulative left positions for smooth indicator translation
  const { tabWidths, tabOffsets } = useMeasureFlatListTabsLayout({
    tabsLength: tabs.length,
    sidePadding: _sidePadding,
    gap: _gap,
  });

  const ref = useRef<FlatList>(null);

  // Tracks horizontal scroll position for indicator compensation during scroll
  const offsetX = useSharedValue(0);

  // Worklet-optimized scroll handler runs on UI thread for 60fps indicator updates
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      offsetX.value = event.contentOffset.x; // Drives TabIndicator translateX compensation
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
        // Smart scroll positioning based on current viewport visibility
        const isPrevItemVisible = viewableItems.some((item) => item.index === index - 1);
        const isCurrentItemVisible = viewableItems.some((item) => item.index === index);

        // Position calculation: if previous item visible, align to right edge (1), else left edge (0)
        const viewPosition = isPrevItemVisible ? 1 : 0;
        // Offset ensures proper padding: negative offset pulls item inward, positive pushes outward
        const viewOffset = isPrevItemVisible ? -_sidePadding : _sidePadding;

        // Only scroll if target tab isn't already visible to avoid unnecessary animation
        if (!isCurrentItemVisible) {
          ref.current?.scrollToIndex({ index, viewPosition, viewOffset });
        }
      }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        // Update shared value array with actual rendered tab width for indicator calculations
        tabWidths.modify((value) => {
          "worklet"; // Runs on UI thread for immediate indicator width updates
          value[index] = width; // Store width at tab's index position
          return value;
        });
      }}
    />
  );

  return (
    <View>
      {/* Animated indicator positioned behind tabs for proper z-layering */}
      <TabIndicator
        activeTab={activeTab} // Drives indicator position interpolation
        tabBarOffsetX={offsetX} // Compensates indicator position during horizontal scroll
        tabWidths={tabWidths} // Dynamic width sizing for responsive indicator
        tabOffsets={tabOffsets} // Left position calculations for smooth translation
      />
      {/* Animated.FlatList enables scroll event worklets for smooth indicator compensation */}
      <Animated.FlatList
        ref={ref}
        data={tabs}
        keyExtractor={(item) => item.value.toString()}
        renderItem={_renderItem}
        horizontal
        contentContainerStyle={{ paddingHorizontal: _sidePadding, gap: _gap }}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler} // Worklet-optimized for UI thread execution
        scrollEventThrottle={1000 / 60} // ~60fps scroll updates for smooth indicator tracking
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100, // Only consider fully visible items
          minimumViewTime: 16, // ~60fps minimum visibility duration prevents flicker
        }}
        onViewableItemsChanged={({ viewableItems }) => {
          setViewableItems(viewableItems); // Tracks visible tabs for smart scroll positioning
        }}
      />
    </View>
  );
};

// linear-button-tabs-indicator-animation 🔼
