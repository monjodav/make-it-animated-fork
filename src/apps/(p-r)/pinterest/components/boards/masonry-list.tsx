import { FlashList, MasonryFlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import React, { FC, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { WithPullToRefresh } from "../with-pull-to-refresh";
import { sharedConfigs } from "../../lib/constants/pull-to-refresh-animation";
import { Board } from "../../lib/types";
import { useScrollToTop } from "@react-navigation/native";

// pinterest-pull-to-refresh-loading-animation 🔽

const AnimatedList = Animated.createAnimatedComponent(MasonryFlashList);

type Props = {
  board: Board;
};

export const MasonryList: FC<Props> = ({ board }) => {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setData(board.pins);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const listOffsetY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const listOffsetYOnEndDrag = useSharedValue(0);
  const refreshing = useSharedValue(false);
  const isRefreshed = useSharedValue(false);
  const isHapticTriggered = useSharedValue(false);

  const listRef = useRef<FlashList<Board>>(null);

  useScrollToTop(listRef);

  const refresh = async () => {
    refreshing.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    refreshing.value = false;
    isRefreshed.value = true;
  };

  const handleHaptics = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isHapticTriggered.value = true;
  };

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (event) => {
      const y = event.contentOffset.y;
      isDragging.value = true;
      if (y === 0 && isRefreshed.value) {
        isRefreshed.value = false;
      }
    },
    onScroll: (event) => {
      const y = event.contentOffset.y;
      listOffsetY.value = y;

      if (listOffsetY.value < -sharedConfigs.refreshingTriggerOffset && !isHapticTriggered.value) {
        runOnJS(handleHaptics)();
      } else if (
        isHapticTriggered.value &&
        Math.abs(listOffsetY.value) < sharedConfigs.refreshingTriggerOffset
      ) {
        isHapticTriggered.value = false;
      }
    },
    onEndDrag: (event) => {
      isDragging.value = false;
      const y = event.contentOffset.y;
      listOffsetYOnEndDrag.value = -y;

      if (listOffsetY.value < -sharedConfigs.refreshingTriggerOffset && !refreshing.value) {
        runOnJS(refresh)();
      }
    },
  });

  const _renderListHeader = () => {
    if (board.slug === "all") return <></>;

    return (
      <View className="flex-row items-center gap-3 px-5 pb-4">
        <View className="w-12 h-12 rounded-xl bg-neutral-900" />
        <View className="flex-1 gap-1">
          <View className="h-4 w-[30%] rounded-full bg-neutral-900" />
          <View className="h-3 w-[15%] rounded-full bg-neutral-900" />
        </View>
      </View>
    );
  };

  const _renderItem = ({ index }: { index: number }) => {
    const height = Math.floor(Math.random() * 200) + 100;

    return (
      <View
        style={
          index % 2 === 0
            ? {
                paddingRight: 4,
              }
            : {
                paddingLeft: 4,
              }
        }
        className="px-3"
      >
        <View className="w-full rounded-2xl bg-neutral-900" style={{ height }} />
      </View>
    );
  };

  const _renderItemSeparator = () => {
    return <View className="h-3" />;
  };

  if (loading) {
    return (
      <View className="pt-[65px]">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <WithPullToRefresh
      listOffsetY={listOffsetY}
      listOffsetYOnEndDrag={listOffsetYOnEndDrag}
      isDragging={isDragging}
      refreshing={refreshing}
      isRefreshed={isRefreshed}
    >
      <AnimatedList
        ref={listRef}
        entering={FadeInDown}
        data={data}
        numColumns={2}
        ListHeaderComponent={_renderListHeader}
        renderItem={_renderItem}
        ItemSeparatorComponent={_renderItemSeparator}
        estimatedItemSize={200}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 6 }}
      />
    </WithPullToRefresh>
  );
};

// pinterest-pull-to-refresh-loading-animation 🔼
