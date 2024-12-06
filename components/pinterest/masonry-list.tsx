import { MasonryFlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import React, { FC } from "react";
import { View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { _refreshingTriggerOffset, WithPullToRefresh } from "./with-pull-to-refresh";

const AnimatedList = Animated.createAnimatedComponent(MasonryFlashList);

const _data = Array.from({ length: 20 }).map((_, index) => ({ id: index }));

export const MasonryList: FC = () => {
  const listOffsetY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const listOffsetYOnEndDrag = useSharedValue(0);
  const refreshing = useSharedValue(false);
  const isRefreshed = useSharedValue(false);

  const refresh = async () => {
    refreshing.value = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    refreshing.value = false;
    isRefreshed.value = true;
  };

  const handleHaptics = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

      if (listOffsetY.value < -_refreshingTriggerOffset) {
        runOnJS(handleHaptics)();
      }
    },
    onEndDrag: (event) => {
      isDragging.value = false;
      const y = event.contentOffset.y;
      listOffsetYOnEndDrag.value = -y;

      if (listOffsetY.value < -_refreshingTriggerOffset && !refreshing.value) {
        runOnJS(refresh)();
      }
    },
  });

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

  return (
    <WithPullToRefresh
      listOffsetY={listOffsetY}
      listOffsetYOnEndDrag={listOffsetYOnEndDrag}
      isDragging={isDragging}
      refreshing={refreshing}
      isRefreshed={isRefreshed}
    >
      <AnimatedList
        data={_data}
        numColumns={2}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={_renderItem}
        estimatedItemSize={200}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </WithPullToRefresh>
  );
};
