import React, { useRef } from "react";
import { Insets, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { LargeTitle } from "@/components/whatsapp/large-title";
import { SearchBar } from "@/components/whatsapp/search-bar";
import { UpdatesContent } from "@/components/whatsapp/updates-content";

const _searchBarHeight = 36;
const _searchBarMarginBottomMin = 12;
const _searchBarMarginBottomMax = 36;

const _searchBarMarginBottomDistance = _searchBarMarginBottomMax - _searchBarMarginBottomMin;

const _searchBarAnimationDistance = _searchBarHeight + _searchBarMarginBottomDistance;

export default function Updates() {
  const headerHeight = useHeaderHeight();

  const scrollRef = useRef<Animated.ScrollView>(null);

  const offsetY = useSharedValue(0);

  const scrollToOffset = (offset: number) => {
    scrollRef.current?.scrollTo({ y: offset, animated: true });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y;
    },
    onEndDrag: ({ contentOffset: { y } }) => {
      if (y <= _searchBarHeight / 2) {
        runOnJS(scrollToOffset)(0);
      }
      if (y > _searchBarHeight / 2 && y < _searchBarAnimationDistance) {
        runOnJS(scrollToOffset)(_searchBarAnimationDistance);
      }
    },
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(
        offsetY.value,
        [0, _searchBarAnimationDistance],
        [0, _searchBarAnimationDistance],
        Extrapolation.CLAMP
      ),
    };
  });

  const rScrollIndicatorInsets = useDerivedValue<Insets>(() => {
    return {
      top: interpolate(
        offsetY.value,
        [0, _searchBarAnimationDistance, _searchBarAnimationDistance + 10],
        [0, 0, 10],
        {
          extrapolateLeft: "clamp",
        }
      ),
    };
  });

  return (
    <View className="flex-1 bg-neutral-950">
      <Animated.ScrollView
        ref={scrollRef}
        style={rContainerStyle}
        contentContainerStyle={{ paddingTop: headerHeight + 16 }}
        contentContainerClassName="p-5"
        indicatorStyle="white"
        scrollIndicatorInsets={rScrollIndicatorInsets}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      >
        <LargeTitle
          title="Updates"
          offsetY={offsetY}
          searchBarAnimationDistance={_searchBarAnimationDistance}
          className="mb-4"
        />
        <SearchBar
          offsetY={offsetY}
          height={_searchBarHeight}
          marginBottomMin={_searchBarMarginBottomMin}
          marginBottomMax={_searchBarMarginBottomMax}
        />
        <UpdatesContent offsetY={offsetY} />
      </Animated.ScrollView>
    </View>
  );
}
