import { MasonryFlashList } from "@shopify/flash-list";
import React, { FC, useState } from "react";
import { View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { _loadingIndicatorDiameter, LoadingIndicator } from "./loading-indicator";

const AnimatedList = Animated.createAnimatedComponent(MasonryFlashList);

const _data = Array.from({ length: 20 }).map((_, index) => ({ id: index }));

export const MasonryList: FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const offsetY = useSharedValue(0);

  const refresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      offsetY.value = y;

      if (y <= -_loadingIndicatorDiameter && !refreshing) {
        console.log("🔴 refresh 🔴"); // VS remove
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
    <View className="flex-1">
      <LoadingIndicator offsetY={offsetY} />
      <AnimatedList
        data={_data}
        numColumns={2}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={_renderItem}
        estimatedItemSize={200}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
};
