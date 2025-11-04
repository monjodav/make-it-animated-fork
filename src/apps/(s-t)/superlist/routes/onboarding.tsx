import { UserRound } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { FlatList, Platform, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SlideItem } from "../components/slide-item";
import Pagination from "../components/pagination";
import { scheduleOnRN } from "react-native-worklets";

export const SLIDES = [
  {
    bgColor: "#7872E0",
    duration: 2000,
  },
  {
    bgColor: "#FB5A44",
    duration: 2000,
  },
  {
    bgColor: "#7872E0",
    duration: 2000,
  },
  {
    bgColor: "#2188DA",
    duration: 1000,
  },
  {
    bgColor: "#7872E0",
    duration: 2000,
  },
];

const DEFAULT_SLIDE_DURATION = 2000;

export const Onboarding = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalListRef = useRef<FlatList>(null);

  const data = useMemo(() => [SLIDES.at(-1)!, ...SLIDES, SLIDES.at(0)!], []);

  const activeIndex = useSharedValue(1);
  const scrollOffsetX = useSharedValue(0);
  const autoScrollProgress = useSharedValue(0);
  const progressSlideIndex = useSharedValue(0); // Track which slide shows progress
  const isAutoScrolling = useRef(true);
  const isDragging = useSharedValue(false);
  const progressBeforeDrag = useSharedValue(0);

  const scrollToNextSlide = useCallback(
    (currentIndex: number) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= data.length - 1) {
        // Loop back to first real slide
        // horizontalListRef.current?.scrollToIndex({ index: 1, animated: true });
      } else {
        horizontalListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }
    },
    [data.length]
  );

  const restartAutoScroll = useCallback(() => {
    const currentSlideIndex = Math.round(activeIndex.get());
    const realIndex = currentSlideIndex - 1;
    const currentSlide = SLIDES[realIndex];
    const duration = currentSlide?.duration || DEFAULT_SLIDE_DURATION;

    progressSlideIndex.set(realIndex);
    autoScrollProgress.set(0);
    progressBeforeDrag.set(0);

    autoScrollProgress.set(
      withTiming(1, { duration }, (finished) => {
        if (finished && isAutoScrolling.current) {
          autoScrollProgress.set(0);

          scheduleOnRN(scrollToNextSlide, currentSlideIndex);

          setTimeout(() => {
            if (isAutoScrolling.current) {
              scheduleOnRN(startAutoScroll);
            }
          }, 500);
        }
      })
    );
  }, [autoScrollProgress, progressSlideIndex, progressBeforeDrag, activeIndex]);

  const startAutoScroll = useCallback(() => {
    const currentSlideIndex = Math.floor(activeIndex.get());
    const realIndex = currentSlideIndex - 1; // Adjust for cloned first slide
    const currentSlide = SLIDES[realIndex];
    const duration = currentSlide?.duration || 2000;

    // Reset progress and animate to 1 over specified duration
    progressSlideIndex.set(realIndex);
    autoScrollProgress.set(0);
    autoScrollProgress.set(
      withTiming(1, { duration }, (finished) => {
        if (finished && isAutoScrolling.current) {
          autoScrollProgress.set(0);

          scheduleOnRN(scrollToNextSlide, currentSlideIndex);

          // Wait for scroll animation to complete, then start next auto-scroll
          setTimeout(() => {
            if (isAutoScrolling.current) {
              scheduleOnRN(startAutoScroll);
            }
          }, 500);
        }
      })
    );
  }, [autoScrollProgress, activeIndex, progressSlideIndex, scrollToNextSlide]);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      "worklet";
      // Stop auto-scroll and save current progress
      if (isAutoScrolling.current) {
        isDragging.set(true);
        cancelAnimation(autoScrollProgress);
        progressBeforeDrag.set(autoScrollProgress.get());
        // Lock progress to current slide
        progressSlideIndex.set(Math.round(activeIndex.get() - 1));
        isAutoScrolling.current = false;
      }
    },
    onScroll: (event) => {
      "worklet";
      const offsetX = event.contentOffset.x;
      scrollOffsetX.set(offsetX);
      activeIndex.set(offsetX / width);

      // Update progress proportionally during drag
      if (isDragging.get()) {
        const currentIndex = activeIndex.get();
        const startSlideIndex = progressSlideIndex.get() + 1; // Convert back to activeIndex space
        const distanceFromStart = Math.abs(currentIndex - startSlideIndex);

        // Reduce progress proportionally based on distance from starting slide
        if (distanceFromStart > 0 && distanceFromStart < 1) {
          const newProgress = progressBeforeDrag.get() * (1 - distanceFromStart);
          autoScrollProgress.set(Math.max(0, newProgress));
        } else if (distanceFromStart === 0) {
          // Exactly on the starting slide
          autoScrollProgress.set(progressBeforeDrag.get());
        } else {
          // Moved to a different slide completely
          autoScrollProgress.set(0);
        }
      }
    },
    onMomentumEnd: () => {
      "worklet";
      isDragging.set(false);
      isAutoScrolling.current = true;

      // Restart auto-scroll from beginning on the current slide (on JS thread)
      scheduleOnRN(restartAutoScroll);
    },
  });

  useEffect(() => {
    // Start auto-scroll after component mounts
    const timer = setTimeout(() => {
      if (isAutoScrolling.current) {
        startAutoScroll();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      isAutoScrolling.current = false;
      cancelAnimation(autoScrollProgress);
    };
  }, [startAutoScroll]);

  return (
    <View
      className="flex-1 bg-slate-900"
      style={[{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}
    >
      <Animated.FlatList
        ref={horizontalListRef}
        data={data}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} width={width} scrollOffsetX={scrollOffsetX} />
        )}
        horizontal
        pagingEnabled
        initialScrollIndex={1}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
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
        activeIndex={activeIndex}
        slides={SLIDES}
        autoScrollProgress={autoScrollProgress}
        progressSlideIndex={progressSlideIndex}
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
