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
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

// x-bottom-tabs-background-animation 🔽

export default function Home() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const { tabBarHeight, handleMomentumBegin, handleScroll } = useContext(XTabsContext);

  const listOffsetY = useSharedValue(0);
  const listOffsetYRefPoint = useSharedValue(0);

  const headerState = useSharedValue<"expanded" | "idle" | "collapsed">("expanded");
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (e) => {
      listOffsetYRefPoint.value = e.contentOffset.y;
    },
    onMomentumBegin: (e) => {
      handleMomentumBegin(e);
    },
    onScroll: (e) => {
      const offsetY = e.contentOffset.y;

      if (offsetY < headerHeight) {
        headerState.value = "idle";
      }

      listOffsetY.value = offsetY;

      if (offsetY < headerHeight && headerState.value === "idle") {
        headerOpacity.value = interpolate(
          offsetY,
          [0, headerHeight / 2],
          [1, 0],
          Extrapolation.CLAMP
        );
        headerTranslateY.value = interpolate(
          offsetY,
          [0, headerHeight],
          [0, -headerHeight],
          Extrapolation.CLAMP
        );
      }

      const isScrollingToBottom = e.contentOffset.y > listOffsetYRefPoint.value;
      const isScrollingToTop = e.contentOffset.y < listOffsetYRefPoint.value;

      if (offsetY > 0 && isScrollingToBottom) {
        if (headerState.value === "collapsed") {
          return;
        }

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
      } else if (offsetY > 0 && isScrollingToTop) {
        if (headerState.value === "expanded") {
          return;
        }

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
  });

  useDerivedValue(() => {
    if (headerTranslateY.value === -headerHeight) {
      headerState.value = "collapsed";
    }
    if (headerTranslateY.value === 0) {
      headerState.value = "expanded";
    }
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
