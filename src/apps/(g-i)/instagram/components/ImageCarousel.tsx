import React, { FC } from "react";
import { View, FlatList, useWindowDimensions, Text } from "react-native";
import { useImageCarousel } from "../lib/providers/image-carousel-provider";

// instagram-image-carousel-animation 🔽

export const ImageCarousel: FC = () => {
  const { images, carouselRef, onViewableItemsChanged, onScrollToIndexFailed } = useImageCarousel();

  const { width } = useWindowDimensions();

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
        onViewableItemsChanged={onViewableItemsChanged}
        onScrollToIndexFailed={onScrollToIndexFailed}
      />
    </View>
  );
};

// instagram-image-carousel-animation 🔼
