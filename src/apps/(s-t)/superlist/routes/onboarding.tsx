import { UserRound } from "lucide-react-native";
import { useMemo, useRef } from "react";
import { FlatList, Platform, Text, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SlideItem } from "../components/slide-item";
import Pagination from "../components/pagination";

export const SLIDES = [
  {
    bgColor: "#7872E0",
  },
  {
    bgColor: "#FB5A44",
  },
  {
    bgColor: "#7872E0",
  },
  {
    bgColor: "#2188DA",
  },
  {
    bgColor: "#7872E0",
  },
];

export const Onboarding = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalListRef = useRef<FlatList>(null);

  const data = useMemo(() => [SLIDES.at(-1)!, ...SLIDES, SLIDES.at(0)!], []);

  const activeIndex = useSharedValue(1);

  const scrollOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    const offsetX = event.contentOffset.x;
    scrollOffsetX.set(offsetX);
    activeIndex.set(offsetX / width);
  });

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
      <Pagination activeIndex={activeIndex} slides={SLIDES} />
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
