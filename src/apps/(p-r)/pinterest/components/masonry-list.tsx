import { FlashList } from "@shopify/flash-list";
import React, { FC, memo, useRef, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { WithPullToRefresh } from "../../../../shared/components/with-pull-to-refresh";
import { Board } from "../lib/types";
import { useScrollToTop } from "@react-navigation/native";
import { LoadingIndicator } from "./loading-indicator";

// pinterest-pull-to-refresh-loading-animation 🔽

// Wrap FlashList to allow Reanimated props (e.g., entering, animated styles) to run on UI thread
const AnimatedList = Animated.createAnimatedComponent(FlashList);

type Props = {
  boardName: string;
  data: number[];
};

const MasonryList: FC<Props> = ({ boardName, data }) => {
  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef<FlashList<Board>>(null);

  useScrollToTop(listRef);

  const refresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setRefreshing(false);
  };

  const _renderListHeader = React.useCallback(() => {
    if (boardName === "All" || data.length === 0) return <></>;

    return (
      <View className="flex-row items-center gap-3 px-5 pb-4">
        <View className="w-12 h-12 rounded-xl bg-neutral-900" />
        <View className="flex-1 gap-1">
          <View className="h-4 w-[30%] rounded-full bg-neutral-900" />
          <View className="h-3 w-[15%] rounded-full bg-neutral-900" />
        </View>
      </View>
    );
  }, [boardName, data]);

  const _renderItem = React.useCallback(() => {
    const height = Math.floor(Math.random() * 200) + 100;

    return (
      <View className="px-1.5">
        <View
          className="w-full rounded-2xl bg-neutral-900 items-center justify-center mb-3"
          style={{ height }}
        />
      </View>
    );
  }, []);

  const _renderItemSeparator = () => {
    return <View className="h-3" />;
  };

  return (
    <WithPullToRefresh
      // Custom spinner; driven by shared refreshProgress from provider for tight coupling
      refreshComponent={<LoadingIndicator />}
      refreshing={refreshing}
      onRefresh={refresh}
      refreshViewBaseHeight={400}
      // Triggers haptic when reaching threshold in given direction to match OS affordance
      hapticFeedbackDirection="to-bottom"
      // Time to animate content back after release; slightly longer for Pinterest-like elasticity
      backAnimationDuration={700}
    >
      <AnimatedList
        ref={listRef}
        // Initial content appearance; short downward fade grounds the list under the refresh header
        entering={FadeInDown}
        data={data}
        numColumns={2}
        masonry
        horizontal={false}
        ListHeaderComponent={_renderListHeader}
        renderItem={_renderItem}
        ItemSeparatorComponent={_renderItemSeparator}
        showsVerticalScrollIndicator={false}
        // Top padding creates space so the refresh indicator can overlap without jumping content
        contentContainerStyle={{ paddingTop: 50 }}
        // Disable scroll during active refresh to prevent gesture conflicts with spring back animation
        scrollEnabled={!refreshing}
      />
    </WithPullToRefresh>
  );
};

export default memo(MasonryList);

// pinterest-pull-to-refresh-loading-animation 🔼
