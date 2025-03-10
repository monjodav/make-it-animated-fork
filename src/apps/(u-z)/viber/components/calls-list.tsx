import React, { FC } from "react";
import { View } from "react-native";
import Animated, { SharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import { CallsListItem } from "./calls-list-item";

type Props = {
  offsetY: SharedValue<number>;
  headerHeight: number;
  largeTitleHeight: number;
};

export const CallsList: FC<Props> = ({ offsetY, headerHeight, largeTitleHeight }) => {
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y;
    },
  });

  return (
    <Animated.FlatList
      data={Array.from({ length: 20 }, (_, index) => index)}
      renderItem={({ item }) => <CallsListItem key={item} />}
      ListHeaderComponent={() => <View className="h-[75px] bg-neutral-900 rounded-2xl" />}
      contentContainerClassName="gap-4 p-5 pt-3"
      contentContainerStyle={{ paddingTop: headerHeight + 16 }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={1000 / 60}
      onScroll={scrollHandler}
    />
  );
};
