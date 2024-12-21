import { HomeHeader } from "@/components/x/home-header";
import { HomePost } from "@/components/x/home-post";
import { XTabsContext } from "@/providers/x-tabs-provider";
import { useContext, useState } from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// x-bottom-tabs-background-animation 🔽

export default function Home() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const { tabBarHeight, handleMomentumBegin, handleScroll } = useContext(XTabsContext);

  const listOffsetY = useSharedValue(0);
  const listOffsetYRefPoint = useSharedValue(0);
  const isListDragging = useSharedValue(false);
  const draggingRefPointY = useSharedValue(0);
  const draggingDirection = useSharedValue<"up" | "down">("down");

  const headerState = useSharedValue<"expanded" | "idle" | "collapsed" | "transition">("idle");
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (e) => {
      listOffsetYRefPoint.value = e.contentOffset.y;
      isListDragging.value = true;
    },
    onMomentumBegin: handleMomentumBegin,
    onScroll: (e) => {
      const offsetY = e.contentOffset.y;

      if (offsetY < headerHeight) {
        headerState.value = "idle";
      }

      listOffsetY.value = offsetY;

      draggingRefPointY.value = withTiming(offsetY, { duration: 1000 / 60 });

      if (offsetY < headerHeight && headerState.value === "idle" && isListDragging.value === true) {
        headerState.value = "transition";

        headerOpacity.value = interpolate(
          offsetY,
          [listOffsetYRefPoint.value, listOffsetYRefPoint.value + headerHeight / 2],
          [1, 0],
          Extrapolation.CLAMP
        );
        headerTranslateY.value = interpolate(
          offsetY,
          [listOffsetYRefPoint.value, listOffsetYRefPoint.value + headerHeight],
          [0, -headerHeight],
          Extrapolation.CLAMP
        );
      }

      if (offsetY > draggingRefPointY.value) {
        draggingDirection.value = "down";
      }
      if (offsetY < draggingRefPointY.value) {
        draggingDirection.value = "up";
      }

      if (
        offsetY > headerHeight &&
        draggingDirection.value === "down" &&
        isListDragging.value === true
      ) {
        if (headerState.value === "collapsed") {
          headerOpacity.value = 0;
          headerTranslateY.value = -headerHeight;
          return;
        }

        headerState.value = "transition";

        headerOpacity.value = interpolate(
          offsetY,
          [listOffsetYRefPoint.value, listOffsetYRefPoint.value + headerHeight / 2],
          [1, 0],
          Extrapolation.CLAMP
        );
        headerTranslateY.value = interpolate(
          offsetY,
          [listOffsetYRefPoint.value, listOffsetYRefPoint.value + headerHeight],
          [0, -headerHeight],
          Extrapolation.CLAMP
        );
      }

      if (
        offsetY > headerHeight &&
        draggingDirection.value === "up" &&
        isListDragging.value === true
      ) {
        if (headerState.value === "expanded") {
          headerOpacity.value = 1;
          headerTranslateY.value = 0;
          return;
        }

        headerState.value = "transition";

        headerOpacity.value = interpolate(
          offsetY,
          [listOffsetYRefPoint.value, listOffsetYRefPoint.value - headerHeight / 2],
          [0, 1],
          Extrapolation.CLAMP
        );
        headerTranslateY.value = interpolate(
          offsetY,
          [listOffsetYRefPoint.value, listOffsetYRefPoint.value - headerHeight],
          [-headerHeight, 0],
          Extrapolation.CLAMP
        );
      }

      handleScroll(e);
    },
    onEndDrag: () => {
      isListDragging.value = false;

      if (headerState.value === "transition" && listOffsetY.value < headerHeight) {
        headerOpacity.value = withTiming(1, { duration: 200 });
        headerTranslateY.value = withTiming(0, { duration: 200 });
        headerState.value = "idle";
        return;
      }

      if (headerState.value === "transition" && draggingDirection.value === "down") {
        headerOpacity.value = withTiming(0, { duration: 200 });
        headerTranslateY.value = withTiming(-headerHeight, { duration: 200 });
        headerState.value = "collapsed";
        return;
      }

      if (headerState.value === "transition" && draggingDirection.value === "up") {
        headerOpacity.value = withTiming(1, { duration: 200 });
        headerTranslateY.value = withTiming(0, { duration: 200 });
        headerState.value = "expanded";
        return;
      }
      // Add one more shared value to write the transition separataly
    },
  });

  const rHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: headerTranslateY.value,
      },
    ],
  }));

  const _renderItem = () => {
    return <HomePost />;
  };

  const _renderItemSeparator = () => {
    return <View className="h-px bg-x-front my-6" />;
  };

  return (
    <View className="flex-1 bg-x-back">
      <Animated.View
        style={rHeaderStyle}
        className="absolute top-0 left-0 right-0 z-50"
        onLayout={({ nativeEvent }) => {
          setHeaderHeight(nativeEvent.layout.height);
        }}
      >
        <HomeHeader />
      </Animated.View>
      <Animated.FlatList
        data={Array.from({ length: 20 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={_renderItem}
        ItemSeparatorComponent={_renderItemSeparator}
        contentContainerClassName="pt-5"
        contentContainerStyle={{
          paddingTop: headerHeight + 16,
          paddingBottom: tabBarHeight + 16,
        }}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
}

// x-bottom-tabs-background-animation 🔼
