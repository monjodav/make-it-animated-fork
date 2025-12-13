import { FC } from "react";
import { useWindowDimensions, View } from "react-native";
import { CarouselItem } from "./carousel-item";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { NutrientsItem } from "../../routes/nutrients";

type Props = {
  slides: NutrientsItem[];
};

export const Carousel: FC<Props> = ({ slides }) => {
  const { width: screenWidth } = useWindowDimensions();

  const _itemWidth = screenWidth;
  const _itemHeight = _itemWidth;

  const animatedIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      animatedIndex.set(event.contentOffset.x / _itemWidth);
    },
  });

  return (
    <View style={{ height: _itemHeight, width: screenWidth }}>
      <Animated.FlatList
        data={slides}
        renderItem={({ item, index }) => (
          <CarouselItem
            index={index}
            itemWidth={_itemWidth}
            itemHeight={_itemHeight}
            slide={item}
            animatedIndex={animatedIndex}
          />
        )}
        horizontal
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />
    </View>
  );
};
