import { FC, useCallback, useMemo, useRef, useState } from "react";
import { Platform, useWindowDimensions, ViewToken } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SlideItem } from "../components/slide-item";
import Pagination from "./pagination";
import { CarouselProps } from "./lib/types";
import { scheduleOnRN } from "react-native-worklets";

const Carousel: FC<CarouselProps> = ({
  setCurrentSlideIndex,
  horizontalListRef,
  scrollHandler,
  currentSlideIndex,
  translateY,
  scrollOffsetX,
  SLIDES,
  isDragging,
  animatedSlideIndex,
  topCarouselOffset,
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const data = useMemo(() => [SLIDES.at(-1)!, ...SLIDES, SLIDES.at(0)!], []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        // Get the first viewable item (should be only one with pagingEnabled)
        const viewableItem = viewableItems[0];
        if (viewableItem && viewableItem.index !== null) {
          setCurrentSlideIndex(viewableItem.index);
        }
      }
    },
    [setCurrentSlideIndex]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
    minimumViewTime: 0,
  }).current;

  const handleScrollToIndex = useCallback((index: number) => {
    horizontalListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  }, []);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.get() }],
    };
  });

  const rPaginationStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.get(),
        [0, -topCarouselOffset * 0.25],
        [1, 0],
        Extrapolation.CLAMP
      ),
      pointerEvents: translateY.get() === 0 ? "auto" : "none",
    };
  });

  const [horizontalScrollEnabled, setHorizontalScrollEnabled] = useState(false);
  useDerivedValue(() => {
    const atTop = translateY.get() <= -topCarouselOffset;
    scheduleOnRN(setHorizontalScrollEnabled, !atTop);
  }, []);

  return (
    <Animated.View
      className="absolute w-full"
      style={[
        {
          top: insets.top,
          height: screenHeight - insets.top - insets.bottom - 60,
        },
        rContainerStyle,
      ]}
    >
      <Animated.FlatList
        ref={horizontalListRef}
        data={data}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} width={screenWidth} scrollOffsetX={scrollOffsetX} />
        )}
        horizontal
        pagingEnabled
        initialScrollIndex={1}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onStartReached={() => {
          if (Platform.OS === "android") {
            // Android needs delay to prevent scroll conflict during momentum
            setTimeout(() => {
              horizontalListRef?.current?.scrollToIndex({
                index: data.length - 2,
                animated: false,
              });
            }, 100);
          } else {
            horizontalListRef?.current?.scrollToIndex({
              index: data.length - 2,
              animated: false,
            });
          }
        }}
        onEndReached={() => {
          if (Platform.OS === "android") {
            // Android needs delay to prevent scroll conflict during momentum
            setTimeout(() => {
              horizontalListRef?.current?.scrollToIndex({ index: 1, animated: false });
            }, 100);
          } else {
            horizontalListRef?.current?.scrollToIndex({ index: 1, animated: false });
          }
        }}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={data.length > 3 && horizontalScrollEnabled}
      />
      <Animated.View style={rPaginationStyle}>
        <Pagination
          slides={SLIDES}
          currentSlideIndex={currentSlideIndex}
          animatedSlideIndex={animatedSlideIndex}
          isDragging={isDragging}
          handleScrollToIndex={handleScrollToIndex}
          translateY={translateY}
          topCarouselOffset={topCarouselOffset}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default Carousel;
