import React, { FC } from "react";
import { View, FlatList, ListRenderItem } from "react-native";
import { CarouselImage, useCarousel } from "./carousel-context";

// instagram-pagination-dots-animation 🔽

type Props = {
  renderItem: ListRenderItem<CarouselImage>;
  width: number;
};

export const CarouselContent: FC<Props> = ({ renderItem, width }) => {
  const { images, carouselRef, onViewableItemsChanged, onScrollToIndexFailed } = useCarousel();

  return (
    <View style={{ width }}>
      <FlatList
        ref={carouselRef}
        data={images}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled // Snaps to full image width for Instagram-style navigation
        viewabilityConfig={{
          itemVisiblePercentThreshold: 55, // 55% visibility threshold for accurate pagination tracking
        }}
        onViewableItemsChanged={onViewableItemsChanged} // Drives dots synchronization
        onScrollToIndexFailed={onScrollToIndexFailed} // Fallback for navigation edge cases
      />
    </View>
  );
};

// instagram-pagination-dots-animation 🔼
