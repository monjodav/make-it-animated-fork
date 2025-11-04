import { UserRound } from "lucide-react-native";
import { useEffect, useMemo, useRef } from "react";
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
    duration: 1000,
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

export const Onboarding = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalListRef = useRef<FlatList>(null);

  const data = useMemo(() => [SLIDES.at(-1)!, ...SLIDES, SLIDES.at(0)!], []);

  const activeIndex = useSharedValue(1);
  const scrollOffsetX = useSharedValue(0);
  const autoScrollProgress = useSharedValue(0);
  const isAutoScrolling = useRef(true);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    const offsetX = event.contentOffset.x;
    scrollOffsetX.set(offsetX);
    activeIndex.set(offsetX / width);
  });

  const scrollToNextSlide = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= data.length - 1) {
      // Loop back to first real slide
      // horizontalListRef.current?.scrollToIndex({ index: 1, animated: true });
    } else {
      horizontalListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const startAutoScroll = () => {
    const currentSlideIndex = Math.floor(activeIndex.get());
    const realIndex = currentSlideIndex - 1; // Adjust for cloned first slide
    const currentSlide = SLIDES[realIndex];
    const duration = currentSlide?.duration || 2000;

    // Reset progress and animate to 1 over specified duration
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
  };

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
