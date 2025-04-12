import React, { FC } from "react";
import { View, FlatList, ListRenderItem } from "react-native";
import { CarouselImage, useCarousel } from ".";

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

// instagram-pagination-dots-animation 🔼
