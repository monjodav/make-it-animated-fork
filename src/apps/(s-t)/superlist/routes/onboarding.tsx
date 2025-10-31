import { UserRound } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SLIDES = [
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

  const [currentIndex, setCurrentIndex] = useState(1);

  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.set(event.contentOffset.x);
    },
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
          <View className="p-4" style={[styles.borderCurve, { width }]}>
            <View
              className="flex-1 items-center justify-center rounded-[20px]"
              style={{ backgroundColor: item.bgColor }}
            >
              <Text className="text-white text-24 font-bold">Slide {index}</Text>
            </View>
          </View>
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
              horizontalListRef.current?.scrollToIndex({ index: data.length - 2, animated: false });
            }, 100);
          } else {
            horizontalListRef.current?.scrollToIndex({ index: data.length - 2, animated: false });
          }
        }}
        onEndReached={() => {
          if (Platform.OS === "android") {
            // Android needs delay to prevent scroll conflict during momentum
            setTimeout(() => {
              horizontalListRef.current?.scrollToIndex({ index: 1, animated: false });
            }, 100);
          } else {
            horizontalListRef.current?.scrollToIndex({ index: 1, animated: false });
          }
        }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 99, // Only trigger when item is almost fully visible
        }}
        onViewableItemsChanged={(info) => {
          // Update pagination dots based on currently visible achievement
          if (typeof info.viewableItems[0]?.index === "number") {
            setCurrentIndex(info.viewableItems[0].index);
          }
        }}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={data.length > 3}
      />

      <View
        style={styles.borderCurve}
        className="flex-row h-[40px] items-center justify-center gap-2 rounded-full mx-20 mt-10 bg-slate-700"
      >
        <UserRound size={16} color="white" />
        <Text className="text-white">Sign UP / Sign In</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
