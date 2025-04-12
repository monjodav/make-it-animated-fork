import { X } from "lucide-react-native";
import { FlatList, ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useMemo, useRef, useState } from "react";
import { AchievementBadge } from "../components/achievment-badge";
import AchievementImage1 from "@/assets/images/misc/github-achievement-1.png";
import AchievementImage2 from "@/assets/images/misc/github-achievement-2.png";
import { AchievementPagination } from "../components/achievement-pagination";

type Achievement = {
  bgColor: string;
  imageSource: number;
};

const achievements: Achievement[] = [
  {
    bgColor: "#18600B",
    imageSource: AchievementImage1,
  },
  {
    bgColor: "#012A60",
    imageSource: AchievementImage2,
  },
];

export default function Achievements() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const data: Achievement[] = useMemo(
    () => [achievements.at(-1)!, ...achievements, achievements.at(0)!],
    []
  );

  const horizontalListRef = useRef<FlatList>(null);

  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const bgColors = useMemo(() => data.map((item) => item.bgColor), [data]);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollX.value,
        data.map((_, i) => i * width),
        bgColors
      ),
    };
  });

  return (
    <Animated.View
      className="flex-1"
      style={[{ paddingBottom: insets.bottom + 10 }, rContainerStyle]}
    >
      <Animated.FlatList
        ref={horizontalListRef}
        data={data}
        renderItem={({ item }) => (
          <ScrollView style={{ width }} contentContainerStyle={{ paddingTop: insets.top + 45 }}>
            <View className="flex-1 items-center">
              <AchievementBadge
                index={data.indexOf(item)}
                imageSource={item.imageSource}
                scrollOffsetX={scrollX}
              />
              <View className="mt-10 w-full items-center">
                <View className="h-12 w-1/2 rounded-full bg-white/10 mb-4" />
                <View className="h-6 w-5/6 rounded-full bg-white/10 mb-2" />
                <View className="h-5 w-3/4 rounded-full bg-white/10 mb-16" />
                <View className="flex-row items-center gap-6 mb-6">
                  <View className="h-4 w-4 rounded-full bg-white/10" />
                  <View className="h-5 w-1/3 rounded-full bg-white/10" />
                </View>
                <View className="flex-row items-center gap-6 mb-4">
                  <View className="h-4 w-4 rounded-full bg-white/10" />
                  <View className="w-1/3 gap-2">
                    <View className="h-4 w-full rounded-full bg-white/10" />
                    <View className="h-4 w-2/3 rounded-full bg-white/10" />
                  </View>
                </View>
                <View className="flex-row items-center gap-6">
                  <View className="h-4 w-4 rounded-full bg-white/10" />
                  <View className="w-1/3 gap-2">
                    <View className="h-4 w-full rounded-full bg-white/10" />
                    <View className="h-4 w-2/3 rounded-full bg-white/10" />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
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
        onStartReached={() =>
          horizontalListRef.current?.scrollToIndex({ index: data.length - 2, animated: false })
        }
        onEndReached={() => horizontalListRef.current?.scrollToIndex({ index: 1, animated: false })}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
        onViewableItemsChanged={(info) => {
          if (typeof info.viewableItems[0]?.index === "number") {
            setCurrentIndex(info.viewableItems[0].index);
          }
        }}
        showsHorizontalScrollIndicator={false}
      />
      {/* Pagination */}
      <AchievementPagination currentIndex={currentIndex - 1} total={data.length - 2} />
      {/* CTA Button */}
      <View className="px-5">
        <View className="h-12 w-full rounded-2xl bg-white/20" />
      </View>
      {/* Close Button */}
      <View
        className="absolute right-4 w-8 h-8 rounded-full bg-white/20 items-center justify-center"
        style={{ top: insets.top + 16 }}
      >
        <X size={16} color="lightgray" />
      </View>
    </Animated.View>
  );
}
