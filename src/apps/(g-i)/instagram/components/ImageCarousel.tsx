import React, { FC, useRef } from "react";
import { View, FlatList, useWindowDimensions, Text } from "react-native";
import { useImageCarousel } from "../lib/providers/image-carousel-provider";

export const ImageCarousel: FC = () => {
  const { images, imageIndex, setImageIndex, carouselRef, dotsListRef, isDotsPressed } =
    useImageCarousel();

  const { width } = useWindowDimensions();

  const refIndex = useRef(0);

  return (
    <View className="aspect-square" style={{ width }}>
      <FlatList
        ref={carouselRef}
        data={images}
        renderItem={({ item }) => (
          <View className="bg-neutral-900 items-center justify-center" style={{ width }}>
            <Text className="text-neutral-500 text-3xl">{item}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        viewabilityConfig={{
          itemVisiblePercentThreshold: 55,
        }}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems.length > 0) {
            const currentIndex = viewableItems[0].index ?? 0;

            if (!isDotsPressed) {
              setImageIndex(currentIndex);
            }

            if (currentIndex - refIndex.current > 2) {
              refIndex.current = currentIndex - 2;
              dotsListRef.current?.scrollToIndex({
                animated: true,
                index: currentIndex - 2,
              });
            }

            if (currentIndex - refIndex.current < 0) {
              refIndex.current = currentIndex;
              dotsListRef.current?.scrollToIndex({
                animated: true,
                index: currentIndex,
              });
            }
          }
        }}
        onScrollToIndexFailed={() =>
          carouselRef.current?.scrollToIndex({
            animated: false,
            index: imageIndex,
          })
        }
      />
    </View>
  );
};
