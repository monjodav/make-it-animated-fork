import React, { type FC } from "react";
import { View } from "react-native";
import { Dot, _dotContainerWidth } from "./dot";
import { useImageCarousel } from "../../lib/providers/image-carousel-provider";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

type Props = {
  defaultDotColor?: string;
  activeDotColor?: string;
};

export const PaginationDots: FC<Props> = ({
  defaultDotColor = "gray",
  activeDotColor = "white",
}) => {
  const { images, imageIndex, dotsListRef } = useImageCarousel();

  const listOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      listOffsetX.value = event.contentOffset.x;
    },
  });

  if (images.length === 1) {
    return <></>;
  }

  return (
    <View
      style={{
        width: _dotContainerWidth * (images.length > 5 ? 7 : images.length),
      }}
    >
      <Animated.FlatList
        ref={dotsListRef}
        // NOTE: we adding +4 dots to have 2 shallow dots on the left and 2 shallow dots on the right
        data={Array.from({ length: images.length > 5 ? images.length + 4 : images.length }).map(
          (_, index) => index
        )}
        renderItem={({ item }) => (
          <Dot
            index={item}
            listOffsetX={listOffsetX}
            // NOTE: we adding +2 as we have 2 shallow dots on the left
            isActive={images.length > 5 ? item === imageIndex + 2 : item === imageIndex}
            totalImages={images.length}
            defaultDotColor={defaultDotColor}
            activeDotColor={activeDotColor}
          />
        )}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </View>
  );
};
