import React, { FC, useRef } from "react";
import { View, FlatList, Platform } from "react-native";
import { HomePost } from "./home-post";
import { useScrollToTop } from "@react-navigation/native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

// threads-home-header-tabs-animation 🔽

type Props = {
  tabName: string;
};

export const HomeTabContent: FC<Props> = ({ tabName }) => {
  // Bottom tab bar height ensures content doesn't get hidden behind navigation
  const tabBarHeight = useBottomTabBarHeight();

  // Ref required for react-navigation's scroll-to-top on tab bar press
  const listRef = useRef<FlatList>(null);
  useScrollToTop(listRef); // Enables scroll-to-top when tapping active tab

  return (
    <Tabs.FlatList // Specialized FlatList from react-native-collapsible-tab-view
      ref={listRef}
      data={Array.from({ length: 10 })} // Mock data for demo posts
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => <HomePost />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        // Platform-specific top padding: iOS needs minimal space, Android requires more
        // Android needs extra padding to account for different header behavior
        paddingTop: Platform.select({ ios: 16, android: 100 }),
        // Bottom padding prevents content from hiding behind tab bar + extra spacing
        paddingBottom: tabBarHeight + 16,
      }}
      // Subtle separator matches Threads design: thin gray line with vertical margins
      ItemSeparatorComponent={() => <View className="h-[0.5px] bg-neutral-800 my-4" />}
    />
  );
};

// threads-home-header-tabs-animation 🔼
