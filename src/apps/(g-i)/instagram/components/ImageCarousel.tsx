import React, { FC } from "react";
import { View, Text, FlatList, useWindowDimensions } from "react-native";
import { useImageCarousel } from "../lib/providers/image-carousel-provider";

export const ImageCarousel: FC = () => {
  const { images, index, setIndex, activeImageIndex, prevImageIndex } = useImageCarousel();

  const { width } = useWindowDimensions();

  return (
    <View className="aspect-square" style={{ width }}>
      <FlatList
        data={images}
        renderItem={() => (
          <View className="bg-neutral-900 items-center justify-center" style={{ width }}>
            <Text className="text-neutral-500 text-3xl">{index}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        viewabilityConfig={{
          itemVisiblePercentThreshold: 60,
        }}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems.length > 0) {
            prevImageIndex.value = activeImageIndex.value;
            activeImageIndex.value = viewableItems[0].index ?? 0;
            setIndex(viewableItems[0].index ?? 0);
            console.log("🔴 as", viewableItems[0].index); // VS --------- Remove Log
          }
        }}
      />
    </View>
  );
};
