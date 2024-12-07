import { configs } from "@/constants/pinterest/configs";
import { MasonryFlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import React, { FC } from "react";
import { View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { WithPullToRefresh } from "./with-pull-to-refresh";

// pinterest-pull-to-refresh-animation 🔽

const AnimatedList = Animated.createAnimatedComponent(MasonryFlashList);

const _data = Array.from({ length: 20 }).map((_, index) => ({ id: index }));

type Props = {
  listHeader?: React.ReactNode;
};

export const MasonryList: FC<Props> = ({ listHeader }) => {
  const listOffsetY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const listOffsetYOnEndDrag = useSharedValue(0);
  const refreshing = useSharedValue(false);
  const isRefreshed = useSharedValue(false);

  const refresh = async () => {
    refreshing.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
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

      if (listOffsetY.value < -configs.refreshingTriggerOffset) {
        runOnJS(handleHaptics)();
      }
    },
    onEndDrag: (event) => {
      isDragging.value = false;
      const y = event.contentOffset.y;
      listOffsetYOnEndDrag.value = -y;

      if (listOffsetY.value < -configs.refreshingTriggerOffset && !refreshing.value) {
        runOnJS(refresh)();
      }
    },
  });

  const _renderListHeader = () => {
    return listHeader;
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
        ListHeaderComponent={_renderListHeader}
        renderItem={_renderItem}
        ItemSeparatorComponent={_renderItemSeparator}
        estimatedItemSize={200}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </WithPullToRefresh>
  );
};

// pinterest-pull-to-refresh-animation 🔼
