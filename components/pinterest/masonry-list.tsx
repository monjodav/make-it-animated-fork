import { MasonryFlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import React, { FC, useState } from "react";
import { View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { _loadingIndicatorDiameter } from "./loading-indicator";
import { WithPullToRefresh } from "./with-pull-to-refresh";

const AnimatedList = Animated.createAnimatedComponent(MasonryFlashList);

const _data = Array.from({ length: 20 }).map((_, index) => ({ id: index }));

export const MasonryList: FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);

  const offsetY = useSharedValue(0);
  const lastOffsetY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const refresh = async () => {
    setRefreshing(true);
    console.log("🔴 refresh 🔴"); // VS remove
    await new Promise((resolve) => setTimeout(resolve, 2000));
    lastOffsetY.value = 0;
    setRefreshing(false);
    setIsRefreshed(true);
  };

  const handleHaptics = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (event) => {
      const y = event.contentOffset.y;
      isDragging.value = true;
      if (y === 0 && isRefreshed) {
        runOnJS(setIsRefreshed)(false);
      }
    },
    onScroll: (event) => {
      const y = event.contentOffset.y;
      offsetY.value = y;

      if (offsetY.value < -_loadingIndicatorDiameter) {
        runOnJS(handleHaptics)();
      }
    },
    onEndDrag: (event) => {
      isDragging.value = false;
      const y = event.contentOffset.y;
      lastOffsetY.value = -y;

      if (offsetY.value < -_loadingIndicatorDiameter && !refreshing) {
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
      offsetY={offsetY}
      lastOffsetY={lastOffsetY}
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
