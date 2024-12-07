import { Tab } from "@/app/pinterest/home";
import { useMeasureFlatListTabsLayout } from "@/hooks/use-measure-flat-list-tabs-layout";
import React, { FC, RefObject, useState } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import Animated, {
  interpolate,
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { TabIndicator } from "./tab-indicator";
import { TabItem } from "./tab-item";

const _sidePadding = 20;
const _gap = 24;

type Props = {
  tabs: Tab[];
  listRef: RefObject<FlatList>;
  listOffsetX: SharedValue<number>;
  isListScrollingX: SharedValue<boolean>;
};

export const TabBar: FC<Props> = ({ tabs, listRef, listOffsetX, isListScrollingX }) => {
  const [activeTab, setActiveTab] = useState<number>(tabs[0].value);

  const { width: windowWidth } = useWindowDimensions();

  const { tabWidths, tabOffsets } = useMeasureFlatListTabsLayout({
    tabsLength: tabs.length,
    sidePadding: _sidePadding,
    gap: _gap,
  });

  const animatedRef = useAnimatedRef();

  const tabBarOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      tabBarOffsetX.value = event.contentOffset.x;
    },
  });

  useDerivedValue(() => {
    const tabsCenter = tabs.map((_, index) => tabOffsets.value[index] + tabWidths.value[index] / 2);

    const firstTabIndexCanBeCentered = tabs.findIndex(
      (_, index) => tabsCenter[index] > windowWidth / 2
    );

    if (firstTabIndexCanBeCentered === -1) {
      return;
    }

    const outputRange = tabsCenter.map((center, index) => {
      if (index < firstTabIndexCanBeCentered) {
        return 0;
      }
      return center - windowWidth / 2;
    });

    const offsetX = interpolate(
      listOffsetX.value / windowWidth,
      Object.keys(tabs).map(Number),
      outputRange
    );

    scrollTo(animatedRef, offsetX, 0, false);
  });

  const _renderItem = ({ item, index }: { item: Tab; index: number }) => (
    <TabItem
      label={item.title}
      onPress={() => {
        setActiveTab(item.value);
        listRef.current?.scrollToIndex({ index: index, animated: true });
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
        tabWidths={tabWidths}
        tabOffsets={tabOffsets}
        tabBarOffsetX={tabBarOffsetX}
        listOffsetX={listOffsetX}
      />
      <Animated.FlatList
        ref={animatedRef}
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
