import { HomeHeader } from "@/components/x/home-header";
import { HomePost } from "@/components/x/home-post";
import { XTabsContext } from "@/providers/x-tabs-provider";
import { BlurView } from "expo-blur";
import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
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
// x-home-header-animation 🔽

const _onEndDragAnimDuration = 100;

export default function Home() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const { tabBarHeight, scrollDirection, handleXTabsOnScroll } = useContext(XTabsContext);

  const listOffsetY = useSharedValue(0);
  const listOffsetYRefPoint = useSharedValue(0);
  const isListDragging = useSharedValue(false);

  const headerOpacity = useSharedValue(1);
  const headerOpacityRefPoint = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);
  const headerTranslateYRefPoint = useSharedValue(0);

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
        headerOpacityRefPoint.value = headerOpacity.value;
        headerTranslateYRefPoint.value = headerTranslateY.value;
      }
    }
  );

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (e) => {
      isListDragging.value = true;
      listOffsetYRefPoint.value = e.contentOffset.y;
      headerOpacityRefPoint.value = headerOpacity.value;
      headerTranslateYRefPoint.value = headerTranslateY.value;
    },
    onScroll: (e) => {
      listOffsetY.value = e.contentOffset.y;
      handleXTabsOnScroll(e);
    },
    onEndDrag: () => {
      isListDragging.value = false;

      if (listOffsetY.value < headerHeight) {
        headerOpacity.value = withTiming(1, { duration: _onEndDragAnimDuration * 2 });
        headerTranslateY.value = withTiming(0, { duration: _onEndDragAnimDuration * 2 });
        headerTransition.value = false;
        return;
      }

      if (
        listOffsetY.value > headerHeight &&
        headerTransition.value === true &&
        scrollDirection.value === "down"
      ) {
        headerOpacity.value = withTiming(0, { duration: _onEndDragAnimDuration });
        headerTranslateY.value = withTiming(-headerHeight, { duration: _onEndDragAnimDuration });
        headerTransition.value = false;
        return;
      }

      if (
        listOffsetY.value > headerHeight &&
        headerTransition.value === true &&
        scrollDirection.value === "up"
      ) {
        headerOpacity.value = withTiming(1, { duration: _onEndDragAnimDuration });
        headerTranslateY.value = withTiming(0, { duration: _onEndDragAnimDuration });
        headerTransition.value = false;
        return;
      }
    },
  });

  const rHeaderStyle = useAnimatedStyle(() => {
    if (
      listOffsetY.value > 0 &&
      scrollDirection.value === "down" &&
      isListDragging.value === true
    ) {
      if (headerState.value === "hidden") {
        return {
          opacity: 0,
          transform: [{ translateY: -headerHeight }],
        };
      }
      headerTransition.value = true;
      headerOpacity.value = interpolate(
        listOffsetY.value,
        [listOffsetYRefPoint.value, listOffsetYRefPoint.value + headerHeight / 2],
        [headerOpacityRefPoint.value, 0],
        Extrapolation.CLAMP
      );
      headerTranslateY.value = interpolate(
        listOffsetY.value,
        [listOffsetYRefPoint.value, listOffsetYRefPoint.value + headerHeight],
        [headerTranslateYRefPoint.value, -headerHeight],
        Extrapolation.CLAMP
      );
    }

    if (listOffsetY.value > 0 && scrollDirection.value === "up" && isListDragging.value === true) {
      if (headerState.value === "visible") {
        return {
          opacity: 1,
          transform: [{ translateY: 0 }],
        };
      }
      headerTransition.value = true;
      headerOpacity.value = interpolate(
        listOffsetY.value,
        [listOffsetYRefPoint.value, listOffsetYRefPoint.value - 2 * headerHeight],
        [headerOpacityRefPoint.value, 1],
        Extrapolation.CLAMP
      );
      headerTranslateY.value = interpolate(
        listOffsetY.value,
        [listOffsetYRefPoint.value, listOffsetYRefPoint.value - 2 * headerHeight],
        [headerTranslateYRefPoint.value, 0],
        Extrapolation.CLAMP
      );
    }

    return {
      opacity: headerOpacity.value,
      transform: [
        {
          translateY: headerTranslateY.value,
        },
      ],
    };
  });

  const rBlurViewStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(listOffsetY.value > headerHeight ? 1 : 0),
    };
  });

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
        {/* BlurView is experimental on Android and should be used with caution */}
        {/* To apply blur effect on Android, you need use experimentalBlurMethod prop */}
        <Animated.View style={[StyleSheet.absoluteFillObject, rBlurViewStyle]}>
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
        </Animated.View>
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

// x-home-header-animation 🔼
// x-bottom-tabs-background-animation 🔼
