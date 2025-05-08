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
  const tabBarHeight = useBottomTabBarHeight();

  const listRef = useRef<FlatList>(null);
  useScrollToTop(listRef);

  return (
    <Tabs.FlatList
      ref={listRef}
      data={Array.from({ length: 10 })}
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => <HomePost />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: Platform.select({ ios: 16, android: 100 }),
        paddingBottom: tabBarHeight + 16,
      }}
      ItemSeparatorComponent={() => <View className="h-[0.5px] bg-neutral-800 my-4" />}
    />
  );
};

// threads-home-header-tabs-animation 🔼
