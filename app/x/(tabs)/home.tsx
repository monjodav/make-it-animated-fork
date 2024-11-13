import { HomePost } from "@/components/x/home-post";
import { XTabsContext } from "@/providers/x-tabs-provider";
import { usePathname } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// x-fab-animation
export default function Home() {
  const { tabBarHeight, isBottomBlurVisible, setIsBottomBlurVisible } = useContext(XTabsContext);
  const insets = useSafeAreaInsets();

  const offsetYRefPoint = useSharedValue(0);

  const pathname = usePathname();

  const scrollHandler = useAnimatedScrollHandler({
    onMomentumBegin: (e) => {
      offsetYRefPoint.value = e.contentOffset.y;
    },
    onScroll: (e) => {
      if (pathname !== "/x/home") return;
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
    <View className="flex-1 bg-x-back">
      <Animated.FlatList
        data={Array.from({ length: 10 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <HomePost />}
        ItemSeparatorComponent={() => <View className="h-px bg-x-front my-6" />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabBarHeight + 16 }}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      />
    </View>
  );
}
