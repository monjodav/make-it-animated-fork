import React, { FC } from "react";
import { View } from "react-native";
import Animated, { ScrollHandlerProcessed } from "react-native-reanimated";
import { HomePost } from "./home-post";

type Props = {
  headerHeight: number;
  tabBarHeight: number;
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
};

export const HomePostsList: FC<Props> = ({ headerHeight, tabBarHeight, scrollHandler }) => {
  const _renderItem = () => {
    return <HomePost />;
  };

  const _renderItemSeparator = () => {
    return <View className="h-px bg-x-front my-6" />;
  };

  return (
    <Animated.FlatList
      data={Array.from({ length: 20 })}
      keyExtractor={(_, index) => index.toString()}
      renderItem={_renderItem}
      ItemSeparatorComponent={_renderItemSeparator}
      contentContainerClassName="pt-5"
      contentContainerStyle={{
        paddingTop: headerHeight + 16,
        paddingBottom: tabBarHeight + 16,
      }}
      scrollEventThrottle={1000 / 60}
      onScroll={scrollHandler}
    />
  );
};
