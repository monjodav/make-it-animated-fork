import { FC, useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import { LegendList } from "@legendapp/list";
import { CarouselItem } from "./carousel-item";
import {
  createAnimatedComponent,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { NutrientsItem } from "../../routes/nutrients";

const AnimatedList = createAnimatedComponent(LegendList);

type Props = {
  slides: NutrientsItem[];
};

const INTERVAL_DURATION = 2000;

export const Carousel: FC<Props> = ({ slides }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const _itemWidth = screenWidth * 0.8;
  const _itemHeight = _itemWidth;

  const animatedIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      animatedIndex.set(event.contentOffset.x / screenWidth);
    },
  });

  return (
    <View style={{ height: _itemHeight }}>
      <AnimatedList
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
      />
    </View>
  );
};
