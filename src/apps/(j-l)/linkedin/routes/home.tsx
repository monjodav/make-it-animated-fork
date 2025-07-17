import { HomeHeader } from "../components/home-header";
import { HomePost } from "../components/home-post";
import { useScrollDirection } from "@/src/shared/lib/hooks/use-scroll-direction";
import { View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// linkedin-header-on-scroll-animation 🔽

const _renderItem = () => <HomePost />;
const _renderItemSeparator = () => <View className="h-2 bg-black" />;

export default function Home() {
  const insets = useSafeAreaInsets();

  // Get scroll direction tracking tools from shared hook
  // This provides a reactive system for header animations based on scroll behavior
  const {
    scrollDirection, // Shared value tracking current scroll direction
    offsetYAnchorOnBeginDrag, // Records Y position when user starts dragging
    onBeginDrag, // Handler to capture initial touch position
    onScroll: scrollDirectionOnScroll, // Worklet to update direction on scroll
  } = useScrollDirection();

  // Raw scroll position tracker - separate from direction detection
  // Using Reanimated shared value for UI thread performance
  const offsetY = useSharedValue(0);

  // Unified scroll handler that updates both position and direction tracking
  // Using Reanimated worklet for optimal performance on UI thread
  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag, // Captures position when drag begins for threshold calculations
    onScroll: (e) => {
      // Update raw scroll position for header animations
      offsetY.value = e.contentOffset.y;
      // Update direction detection system (to-top/to-bottom state)
      scrollDirectionOnScroll(e);
    },
  });

  return (
    <View className="flex-1 bg-linkedin-back" style={{ paddingTop: insets.top }}>
      {/* Pass all animation values to header for coordinated animations */}
      <HomeHeader
        scrollDirection={scrollDirection} // For direction-based show/hide logic
        offsetY={offsetY} // For position-based threshold checks
        offsetYAnchorOnBeginDrag={offsetYAnchorOnBeginDrag} // For calculating scroll distances
      />
      {/* Animated.FlatList optimizes native animations without JS bridge overhead */}
      <Animated.FlatList
        data={Array.from({ length: 10 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={_renderItem}
        ItemSeparatorComponent={_renderItemSeparator}
        scrollEventThrottle={1000 / 60} // ~16ms = 60fps for smooth header animations
        onScroll={scrollHandler} // Combined handler updates all animation values
      />
    </View>
  );
}

// linkedin-header-on-scroll-animation 🔼
