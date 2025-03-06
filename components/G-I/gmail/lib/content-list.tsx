import React, { FC } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "./hooks/use-header-height";
import { useAnimatedList } from "./animated-list-provider";

export const ContentList: FC = () => {
  const insets = useSafeAreaInsets();

  const { headerHeight } = useHeaderHeight();

  const { scrollHandler } = useAnimatedList();

  return (
    <Animated.FlatList
      data={Array.from({ length: 40 })}
      renderItem={() => (
        <View className="flex-row gap-6">
          <View className="w-12 h-12 rounded-full bg-neutral-800/50" />
          <View className="flex-1 gap-2">
            <View className="w-full h-3 rounded-md bg-neutral-800/50" />
            <View className="w-3/4 h-3 rounded-md bg-neutral-800/50" />
          </View>
          <View className="justify-between items-end">
            <View className="w-10 h-3 rounded-md bg-neutral-800/50" />
            <View className="w-4 h-4 rounded-md bg-neutral-800/50" />
          </View>
        </View>
      )}
      contentContainerClassName="gap-8 px-5"
      contentContainerStyle={{
        paddingTop: headerHeight + 28,
        paddingBottom: insets.bottom + 16,
      }}
      onScroll={scrollHandler}
      scrollEventThrottle={1000 / 60}
    />
  );
};
