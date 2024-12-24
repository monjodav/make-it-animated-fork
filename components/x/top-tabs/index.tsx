import { Tabs } from "@/app/x/(tabs)/home";
import { useMeasureFlatListTabsLayout } from "@/hooks/use-measure-flat-list-tabs-layout";
import React, { FC, RefObject, useRef } from "react";
import { FlatList, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { TabIndicator } from "./tab-indicator";
import { TabItem } from "./tab-item";

// x-top-tabs-indicator-animation 🔽

const _sidePadding = 0;
const _gap = 0;

type Props = {
  tabs: Tabs;
  horizontalListRef: RefObject<FlatList>;
  horizontalListOffsetX: SharedValue<number>;
  isHorizontalListScrollingX: SharedValue<boolean>;
  activeTabIndex: SharedValue<number>;
};

export const TopTabs: FC<Props> = ({
  tabs,
  horizontalListRef,
  horizontalListOffsetX,
  isHorizontalListScrollingX,
  activeTabIndex,
}) => {
  const { tabWidths, tabOffsets } = useMeasureFlatListTabsLayout({
    tabsLength: tabs.length,
    sidePadding: _sidePadding,
    gap: _gap,
  });

  const tabsListRef = useRef<FlatList>(null);

  const tabsListOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      tabsListOffsetX.value = event.contentOffset.x;
    },
  });

  const _renderItem = ({ item, index }: { item: Tabs[number]; index: number }) => (
    <TabItem
      label={item.label}
      horizontalListOffsetX={horizontalListOffsetX}
      index={index}
      onPress={() => {
        activeTabIndex.value = item.value;
        tabsListRef.current?.scrollToIndex({ index, viewPosition: 0.5, animated: true });
        horizontalListRef.current?.scrollToIndex({ index, viewPosition: 0.5, animated: true });
        // You can add the fetching logic here
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
        activeTabIndex={activeTabIndex}
        tabBarOffsetX={tabsListOffsetX}
        tabWidths={tabWidths}
        tabOffsets={tabOffsets}
        horizontalListOffsetX={horizontalListOffsetX}
        isHorizontalListScrollingX={isHorizontalListScrollingX}
      />
      <Animated.FlatList
        ref={tabsListRef}
        data={tabs}
        keyExtractor={(item) => item.value.toString()}
        renderItem={_renderItem}
        horizontal
        contentContainerStyle={{ paddingHorizontal: _sidePadding, gap: _gap }}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={1000 / 60}
      />
    </View>
  );
};

// x-top-tabs-indicator-animation 🔼
