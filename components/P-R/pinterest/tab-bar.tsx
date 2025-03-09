import { Tab } from "@/app/(p-r)/pinterest/home";
import { sharedConfigs } from "@/constants/pinterest/navigation-between-boards-animation";
import { useMeasureFlatListTabsLayout } from "@/src/shared/lib/hooks/use-measure-flat-list-tabs-layout";
import React, { FC, RefObject } from "react";
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

// pinterest-navigation-between-boards-animation 🔽

type Props = {
  tabs: Tab[];
  activeTabIndex: SharedValue<number>;
  listRef: RefObject<FlatList>;
  listOffsetX: SharedValue<number>;
  isListScrollingX: SharedValue<boolean>;
};

export const TabBar: FC<Props> = ({
  tabs,
  activeTabIndex,
  listRef,
  listOffsetX,
  isListScrollingX,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const { tabWidths, tabOffsets } = useMeasureFlatListTabsLayout({
    tabsLength: tabs.length,
    sidePadding: sharedConfigs.tabBarSidePadding,
    gap: sharedConfigs.tabBarGap,
  });

  const animatedRef = useAnimatedRef<FlatList>();

  const tabBarOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      tabBarOffsetX.value = event.contentOffset.x;
    },
  });

  useDerivedValue(() => {
    if (!isListScrollingX.value) {
      return;
    }

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
        animatedRef.current?.scrollToIndex({ index, viewPosition: 0.5, animated: true });

        const targetIndex = index;
        const previousIndex = activeTabIndex.value;
        const direction = targetIndex > previousIndex ? "right" : "left";
        const adjacentIndex = direction === "right" ? index - 1 : index + 1;

        listRef.current?.scrollToIndex({ index: adjacentIndex, animated: false });
        listRef.current?.scrollToIndex({ index: targetIndex, animated: true });

        activeTabIndex.value = item.value;

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
        tabWidths={tabWidths}
        tabOffsets={tabOffsets}
        tabBarOffsetX={tabBarOffsetX}
        listOffsetX={listOffsetX}
        isListScrollingX={isListScrollingX}
      />
      <Animated.FlatList
        ref={animatedRef}
        data={tabs}
        keyExtractor={(item) => item.value.toString()}
        renderItem={_renderItem}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: sharedConfigs.tabBarSidePadding,
          gap: sharedConfigs.tabBarGap,
        }}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={1000 / 60}
      />
    </View>
  );
};

// pinterest-navigation-between-boards-animation 🔼
