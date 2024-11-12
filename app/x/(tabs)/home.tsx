import { XTabsContext } from "@/providers/x-tabs-provider";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { useContext } from "react";
import { View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Post = () => {
  return (
    <View className="w-full px-4 flex-row gap-4">
      <View className="w-16 h-16 rounded-full bg-neutral-900" />
      <View className="flex-1">
        <View className="flex-row items-center gap-4 mb-4">
          <View className="flex-1 gap-2">
            <View className="w-40 h-3 rounded-md bg-neutral-900" />
            <View className="w-32 h-3 rounded-md bg-neutral-900" />
          </View>
        </View>
        <View className="gap-2 mb-4">
          <View className="w-full h-3 rounded-md bg-neutral-900" />
          <View className="w-5/6 h-3 rounded-md bg-neutral-900" />
        </View>
        <View className="w-full aspect-video rounded-xl bg-neutral-900" />
      </View>
    </View>
  );
};

// x-fab-animation
export default function Home() {
  const { isBottomBlurVisible, setIsBottomBlurVisible } = useContext(XTabsContext);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const isFocused = useIsFocused();

  const offsetYRefPoint = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onMomentumBegin: (e) => {
      offsetYRefPoint.value = e.contentOffset.y;
    },
    onScroll: (e) => {
      if (!isFocused) return;
      if (offsetYRefPoint.value < 0) return;

      const isScrollingToBottom = e.contentOffset.y > offsetYRefPoint.value;
      const isScrollingToTop = e.contentOffset.y < offsetYRefPoint.value;

      if (isBottomBlurVisible && isScrollingToBottom) {
        runOnJS(setIsBottomBlurVisible)(false);
      } else if (!isBottomBlurVisible && isScrollingToTop) {
        runOnJS(setIsBottomBlurVisible)(true);
      }
    },
  });

  return (
    <View className="flex-1 bg-black">
      <Animated.FlatList
        data={Array.from({ length: 10 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <Post />}
        ItemSeparatorComponent={() => <View className="h-px bg-neutral-900 my-6" />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabBarHeight + 16 }}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      />
    </View>
  );
}
