import { _homePostsListWidth, Tabs } from "@/app/x/(tabs)/home";
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
  const tabWidths = useSharedValue<number[]>(new Array(tabs.length).fill(0));
  const tabOffsets = useSharedValue<number[]>(new Array(tabs.length).fill(0));

  const tabsListRef = useRef<FlatList>(null);

  const tabsListOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      tabsListOffsetX.value = event.contentOffset.x;
    },
  });

  const _renderItem = ({ item, index }: { item: Tabs[number]; index: number }) => (
    <View
      className="items-center justify-center"
      style={{ width: _homePostsListWidth / tabs.length }}
    >
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
          const { width, x } = event.nativeEvent.layout;

          tabWidths.modify((value) => {
            "worklet";
            value[index] = width;
            return value;
          });
          tabOffsets.modify((value) => {
            "worklet";
            value[index] = x + (_homePostsListWidth / tabs.length) * index;
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
      />
    </View>
  );
};

// x-top-tabs-indicator-animation 🔼
