import { HomePostsList } from "@/components/x/home-posts-list";
import { _homePostsListWidth, Tab, Tabs, TopTabs } from "@/components/x/top-tabs";
import { useHeaderAnimation } from "@/hooks/x/use-header-animation";
import { XTabsContext } from "@/providers/x-tabs-provider";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BlurView } from "expo-blur";
import { useContext, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// x-top-tabs-indicator-animation 🔽

const tabs: Tabs = [
  {
    label: "For you",
    value: Tab.ForYou,
  },
  {
    label: "Following",
    value: Tab.Following,
  },
  {
    label: "Next.js",
    value: Tab.NextJs,
  },
];

// x-top-tabs-indicator-animation 🔼

export default function Home() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const insets = useSafeAreaInsets();

  // x-bottom-tabs-background-animation 🔽
  const { tabBarHeight, scrollDirection, handleXTabsOnScroll } = useContext(XTabsContext);

  // x-home-header-animation 🔽
  const { rHeaderStyle, rBlurViewStyle, scrollHandler } = useHeaderAnimation({
    headerHeight,
    scrollDirection,
    handleXTabsOnScroll,
  });
  // x-home-header-animation 🔼

  // x-bottom-tabs-background-animation 🔼

  // x-top-tabs-indicator-animation 🔽
  const horizontalListRef = useRef<FlatList>(null);
  const horizontalListOffsetX = useSharedValue(0);
  const isHorizontalListScrollingX = useSharedValue(false);
  const activeTabIndex = useSharedValue(0);

  const horizontalScrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isHorizontalListScrollingX.value = true;
    },
    onScroll: (event) => {
      horizontalListOffsetX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      isHorizontalListScrollingX.value = false;
      activeTabIndex.value = Math.round(event.contentOffset.x / _homePostsListWidth);
      // You can add the fetching logic here using react-native-reanimated runOnJS;
    },
  });
  // x-top-tabs-indicator-animation 🔼

  return (
    <View className="flex-1 bg-x-back">
      {/* x-home-header-animation 🔽 */}
      <Animated.View
        style={rHeaderStyle}
        className="absolute top-0 left-0 right-0 z-50"
        onLayout={({ nativeEvent }) => {
          setHeaderHeight(nativeEvent.layout.height);
        }}
      >
        {/* BlurView is experimental on Android and should be used with caution */}
        {/* To apply blur effect on Android, you need use experimentalBlurMethod prop */}
        <Animated.View style={[StyleSheet.absoluteFillObject, rBlurViewStyle]}>
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
        </Animated.View>
        <View
          className="bg-x-back/50 border-b border-x-front"
          style={{ paddingTop: insets.top + 8 }}
        >
          <View className="flex-row items-end justify-between mb-2 px-5">
            <View className="w-8 h-8 bg-x-front rounded-full" />
            <View className="absolute top-0 left-0 right-0 bottom-0 flex-row items-center justify-center pointer-events-none">
              <FontAwesome6 name="x-twitter" size={24} color="#e5e5e5" />
            </View>
            <View className="w-[60px] h-8 bg-x-front rounded-full" />
          </View>
          {/* x-top-tabs-indicator-animation 🔽 */}
          <TopTabs
            tabs={tabs}
            horizontalListRef={horizontalListRef}
            horizontalListOffsetX={horizontalListOffsetX}
            isHorizontalListScrollingX={isHorizontalListScrollingX}
            activeTabIndex={activeTabIndex}
          />
          {/* x-top-tabs-indicator-animation 🔼 */}
        </View>
      </Animated.View>
      {/* x-home-header-animation 🔼 */}

      {/* x-top-tabs-indicator-animation 🔽 */}
      <Animated.FlatList
        ref={horizontalListRef}
        data={tabs}
        keyExtractor={(item) => item.value.toString()}
        // x-bottom-tabs-background-animation 🔽
        // x-home-header-animation 🔽
        renderItem={() => (
          <View style={{ width: _homePostsListWidth }}>
            <HomePostsList
              headerHeight={headerHeight}
              tabBarHeight={tabBarHeight}
              scrollHandler={scrollHandler}
            />
          </View>
        )}
        // x-home-header-animation 🔼
        // x-bottom-tabs-background-animation 🔼
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        scrollEventThrottle={1000 / 60}
        onScroll={horizontalScrollHandler}
      />
      {/* x-top-tabs-indicator-animation 🔼 */}
    </View>
  );
}
