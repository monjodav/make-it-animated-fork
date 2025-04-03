import React, { FC, useRef } from "react";
import { View, FlatList, useWindowDimensions, Text } from "react-native";
import { useImageCarousel } from "../lib/providers/image-carousel-provider";

export const ImageCarousel: FC = () => {
  const { images, imageIndex, setImageIndex, dotsListRef } = useImageCarousel();

  const { width } = useWindowDimensions();

  const refIndex = useRef(0);

  return (
    <View className="aspect-square" style={{ width }}>
      <FlatList
        data={images}
        renderItem={() => (
          <View className="bg-neutral-900 items-center justify-center" style={{ width }}>
            <Text className="text-neutral-500 text-3xl">{imageIndex}</Text>
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
            setImageIndex(currentIndex);

            if (currentIndex - refIndex.current === 3) {
              refIndex.current = currentIndex - 2;
              dotsListRef.current?.scrollToIndex({
                animated: true,
                index: currentIndex - 2,
              });
            }

            if (currentIndex - refIndex.current === -1) {
              refIndex.current = currentIndex;
              dotsListRef.current?.scrollToIndex({
                animated: true,
                index: currentIndex,
              });
            }
          }
        }}
      />
    </View>
  );
};
