import { UserRound } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Platform, Text, useWindowDimensions, View, ViewToken } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SlideItem } from "../components/slide-item";
import { OnboardingSlide } from "../components/lib/types";
import Pagination from "../components/pagination";

export const SLIDES: OnboardingSlide[] = [
  {
    bgColor: "#7872E0",
    duration: 3000,
  },
  {
    bgColor: "#FB5A44",
    duration: 3000,
  },
  {
    bgColor: "#7872E0",
    duration: 3000,
  },
  {
    bgColor: "#2188DA",
    duration: 2000,
  },
  {
    bgColor: "#7872E0",
    duration: 3000,
  },
];

export const Onboarding = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const horizontalListRef = useRef<FlatList>(null);

  const data = useMemo(() => [SLIDES.at(-1)!, ...SLIDES, SLIDES.at(0)!], []);

  // Current slide index in the carousel (1-based due to cloned slides)
  const animatedSlideIndex = useSharedValue(1);
  // Horizontal scroll offset for slide animations
  const scrollOffsetX = useSharedValue(0);
  // Whether user is currently dragging the carousel
  const isDragging = useSharedValue(false);

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

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isDragging.set(true);
    },
    onScroll: (event) => {
      const offsetX = event.contentOffset.x;
      scrollOffsetX.set(offsetX);
      animatedSlideIndex.set(offsetX / screenWidth);
    },
    onEndDrag: () => {
      isDragging.set(false);
    },
  });

  const handleScrollToIndex = useCallback((index: number) => {
    horizontalListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  }, []);

  return (
    <View
      className="flex-1 bg-slate-900"
      style={[{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}
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
            horizontalListRef?.current?.scrollToIndex({ index: data.length - 2, animated: false });
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
        scrollEnabled={data.length > 3}
      />
      <Pagination
        slides={SLIDES}
        currentSlideIndex={currentSlideIndex}
        animatedSlideIndex={animatedSlideIndex}
        isDragging={isDragging}
        handleScrollToIndex={handleScrollToIndex}
      />
      <View
        style={{ borderCurve: "continuous" }}
        className="flex-row h-[40px] items-center justify-center gap-2 rounded-full mx-20 mt-10 bg-slate-700"
      >
        <UserRound size={16} color="white" />
        <Text className="text-white">Sign Up / Sign In</Text>
      </View>
    </View>
  );
};
