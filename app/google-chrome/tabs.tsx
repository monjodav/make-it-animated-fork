import React, { useRef } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import { IncognitoTab } from "@/components/google-chrome/incognito-tab";
import { NewTab } from "@/components/google-chrome/new-tab";
import { GroupsTab } from "@/components/google-chrome/groups-tab";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useHeaderTabs } from "@/hooks/google-chrome/use-header-tabs";

// google-chrome-top-tabs-indicator-animation 🔽

const _tabs = [<IncognitoTab key="incognito" />, <NewTab key="new" />, <GroupsTab key="groups" />];

export default function Tabs() {
  const { width, height } = useWindowDimensions();

  const headerHeight = useHeaderHeight();

  const listRef = useRef<FlatList>(null);

  const listOffsetX = useSharedValue(0);
  const tabIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { x } }) => {
      listOffsetX.value = x;
      tabIndex.value = x / width;
    },
  });

  useHeaderTabs({ listRef, tabIndex });

  return (
    <Animated.FlatList
      ref={listRef}
      data={_tabs}
      renderItem={({ item }) => (
        <View style={{ width, height: height - headerHeight }}>{item}</View>
      )}
      className="bg-black"
      contentContainerStyle={{ paddingTop: headerHeight }}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      onScroll={scrollHandler}
      scrollEventThrottle={1000 / 60}
    />
  );
}

// google-chrome-top-tabs-indicator-animation 🔼
