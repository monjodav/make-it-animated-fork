import { HomeHeader } from "@/components/x/home-header";
import { HomePost } from "@/components/x/home-post";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { XTabsContext } from "@/providers/x-tabs-provider";
import { useContext, useState } from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// x-bottom-tabs-background-animation 🔽

export default function Home() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const { tabBarHeight, handleMomentumBegin, handleScroll } = useContext(XTabsContext);

  const { scrollDirection, handleScrollDirectionOnScroll } = useScrollDirection();

  const listOffsetY = useSharedValue(0);
  const listOffsetYRefPoint = useSharedValue(0);
  const isListDragging = useSharedValue(false);

  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  const headerState = useDerivedValue(() => {
    if (headerTranslateY.value === 0) {
      return "visible";
    }

    if (headerTranslateY.value === -headerHeight) {
      return "hidden";
    }
  });
  const headerTransition = useSharedValue(false);

  useAnimatedReaction(
    () => {
      return scrollDirection.value;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        listOffsetYRefPoint.value = listOffsetY.value;
      }
    }
  );

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (e) => {
      listOffsetYRefPoint.value = e.contentOffset.y;
      isListDragging.value = true;
    },
    onMomentumBegin: handleMomentumBegin,
    onScroll: (e) => {
      const offsetY = e.contentOffset.y;

      listOffsetY.value = offsetY;

      handleScrollDirectionOnScroll(e);

      if (
        offsetY < headerHeight &&
        isListDragging.value === true &&
        scrollDirection.value === "down"
      ) {
        headerTransition.value = true;
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
        scrollDirection.value === "down" &&
        isListDragging.value === true
      ) {
        if (headerState.value === "hidden") {
          return;
        }
        headerTransition.value = true;
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
        scrollDirection.value === "up" &&
        isListDragging.value === true
      ) {
        if (headerState.value === "visible") {
          return;
        }
        headerTransition.value = true;
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

      if (
        listOffsetY.value < headerHeight &&
        headerTransition.value === true &&
        scrollDirection.value === "down"
      ) {
        headerOpacity.value = withTiming(1, { duration: 200 });
        headerTranslateY.value = withTiming(0, { duration: 200 });
        headerTransition.value = false;
        return;
      }

      if (
        listOffsetY.value > headerHeight &&
        headerTransition.value === true &&
        scrollDirection.value === "down"
      ) {
        headerOpacity.value = withTiming(0, { duration: 200 });
        headerTranslateY.value = withTiming(-headerHeight, { duration: 200 });
        headerTransition.value = false;
        return;
      }

      if (
        listOffsetY.value > headerHeight &&
        headerTransition.value === true &&
        scrollDirection.value === "up"
      ) {
        headerOpacity.value = withTiming(1, { duration: 200 });
        headerTranslateY.value = withTiming(0, { duration: 200 });
        headerTransition.value = false;
        return;
      }
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
