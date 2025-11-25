import { FC, memo, useEffect } from "react";
import { Dimensions, View } from "react-native";
import { CarouselItem } from "./carousel-item";
import { SharedValue, useSharedValue, withSpring } from "react-native-reanimated";
import { NutrientsItem } from "../../routes/nutrients";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
const ITEM_WIDTH = SCREEN_WIDTH * 0.6;
const ITEM_HEIGHT = 160;
const INTERVAL_DURATION = 2000;
const SPRING_DURATION = 1500;

type Props = {
  slides: NutrientsItem[];
  scrollOffsetX: SharedValue<number>;
};

const CarouselComponent: FC<Props> = ({ slides, scrollOffsetX }) => {
  const allItemsWidth = slides.length * ITEM_WIDTH;
  const activeIndex = Math.round(scrollOffsetX.get() / ITEM_WIDTH);

  const autoScrollActive = useSharedValue(true);

  useEffect(() => {
    let intervalId: any = null;
    autoScrollActive.set(true);
    function startAutoScroll() {
      intervalId = setInterval(() => {
        if (autoScrollActive.get()) {
          scrollOffsetX.set(
            withSpring(scrollOffsetX.get() + ITEM_WIDTH, {
              duration: SPRING_DURATION,
              dampingRatio: 0.74,
            })
          );
        }
      }, INTERVAL_DURATION);
    }
    startAutoScroll();
    return () => {
      if (intervalId) clearInterval(intervalId);
      autoScrollActive.set(false);
    };
  }, []);

  return (
    <View className="h-full flex-row">
      {slides.map((slide, i) => {
        return (
          <CarouselItem
            slide={slide}
            key={`carousel-${i}`}
            index={i}
            scrollOffsetX={scrollOffsetX}
            allItemsWidth={allItemsWidth}
            activeIndex={activeIndex}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            screenWidth={SCREEN_WIDTH}
            screenHeight={SCREEN_HEIGHT}
          />
        );
      })}
    </View>
  );
};

export const Carousel = memo(CarouselComponent);
