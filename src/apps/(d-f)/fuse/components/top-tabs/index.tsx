import React, { FC, RefObject, useRef } from "react";
import { Dimensions, FlatList, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { TabIndicator } from "./tab-indicator";
import { TabItem } from "./tab-item";
import { Tab } from "../../lib/types";
import { useMeasureFlatListTabsLayout } from "@/src/shared/lib/hooks/use-measure-flat-list-tabs-layout";

export const _homePostsListWidth = Dimensions.get("window").width;

const _sidePadding = 16;
const _gap = 8;

type Props = {
  tabs: Tab[];
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

  const _renderItem = ({ item, index }: { item: Tab; index: number }) => (
    <View className="items-center justify-center">
      <TabItem
        index={index}
        label={item.label}
        horizontalListOffsetX={horizontalListOffsetX}
        onPress={() => {
          activeTabIndex.value = item.value;
          tabsListRef.current?.scrollToIndex({ index, animated: true });
          horizontalListRef.current?.scrollToIndex({ index, animated: true });
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
    </View>
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
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={1000 / 60}
        contentContainerStyle={{ paddingHorizontal: _sidePadding, gap: _gap }}
      />
    </View>
  );
};
