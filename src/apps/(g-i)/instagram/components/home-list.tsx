import { View, Text, useWindowDimensions, ScrollView } from "react-native";
import { Carousel, CarouselContent, CarouselPagination } from "../components/carousel";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useHomeHeaderHeight } from "../lib/hooks/use-home-header-height";
import { FC, useCallback } from "react";
import { useAnimatedScroll } from "../lib/providers/animated-scroll";
import { Post } from "../lib/types";
import { FlashList } from "@shopify/flash-list";

const AnimatedFlatList = Animated.createAnimatedComponent(FlashList<Post>);

type Props = {
  posts: Post[];
};

export const HomeList: FC<Props> = ({ posts }) => {
  const { width } = useWindowDimensions();

  const { netHeaderHeight } = useHomeHeaderHeight();

  const { listRef, scrollHandler, listPointerEvents } = useAnimatedScroll();

  const _renderListHeader = useCallback(() => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 gap-5"
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <View key={index} className="items-center gap-3">
            <View className="w-20 h-20 rounded-full bg-neutral-900" />
            <View className="w-20 h-2 rounded-full bg-neutral-900" />
          </View>
        ))}
      </ScrollView>
    );
  }, []);

  const rListStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: listPointerEvents.value ? "auto" : "none",
    };
  });

  return (
    <AnimatedFlatList
      ref={listRef}
      data={posts}
      renderItem={({ item, index }) => (
        // instagram-pagination-dots-animation 🔽
        <Carousel key={index} images={item.images}>
          <CarouselContent
            width={width}
            renderItem={({ item }) => (
              <View
                className="bg-neutral-900 items-center justify-center aspect-square"
                style={{ width }}
              >
                <Text className="text-neutral-600 text-5xl">{item}</Text>
              </View>
            )}
          />
          <View className="p-3 items-center mb-10">
            <CarouselPagination />
          </View>
        </Carousel>
        // instagram-pagination-dots-animation 🔼
      )}
      ListHeaderComponent={_renderListHeader}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="gap-6"
      contentContainerStyle={{ paddingTop: netHeaderHeight + 16 }}
      onScroll={scrollHandler}
      scrollEventThrottle={16} // 16 means 60fps (1000ms / 60fps = 16ms)
      style={rListStyle}
    />
  );
};
