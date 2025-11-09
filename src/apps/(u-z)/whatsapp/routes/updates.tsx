import React, { useRef } from "react";
import { Insets } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { LargeTitle } from "../components/large-title";
import { SearchBar } from "../components/search-bar";
import { UpdatesContent } from "../components/updates-content";
import { scheduleOnRN } from "react-native-worklets";

// whatsapp-updates-screen-header-animation 🔽

// Magic numbers tuned to match WhatsApp proportions
// Height collapses first, then margin shrinks for a two-stage feel
const _searchBarHeight = 36; // visible height at rest
const _searchBarMarginBottomMin = 12; // compact spacing after collapse
const _searchBarMarginBottomMax = 36; // generous spacing at rest

// Total margin animation distance used by the search bar interpolation
const _searchBarMarginBottomDistance = _searchBarMarginBottomMax - _searchBarMarginBottomMin;

// Total scroll distance for full collapse (height → 0, margin → min)
const _searchBarAnimationDistance = _searchBarHeight + _searchBarMarginBottomDistance;

export default function Updates() {
  // Aligns content offset with actual navigation header height (incl. safe area)
  const headerHeight = useHeaderHeight();

  const scrollRef = useRef<Animated.ScrollView>(null);

  // Shared scroll position that coordinates SearchBar collapse, LargeTitle cross-fade, and header blur
  const offsetY = useSharedValue(0);

  const scrollToOffset = (offset: number) => {
    scrollRef.current?.scrollTo({ y: offset, animated: true });
  };

  // Worklet-based handler for 60fps updates; minimal body to reduce GC pressure
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y;
    },
    onEndDrag: ({ contentOffset: { y } }) => {
      // Snap behavior: settle either fully open (0) or fully collapsed (_searchBarAnimationDistance)
      // Threshold at half of search bar height prevents awkward mid states
      if (y <= _searchBarHeight / 2) {
        scheduleOnRN(scrollToOffset, 0);
      }
      if (y > _searchBarHeight / 2 && y < _searchBarAnimationDistance) {
        scheduleOnRN(scrollToOffset, _searchBarAnimationDistance);
      }
    },
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      // Keep outer paddingTop in sync with collapse distance to avoid layout jumps
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
      // After collapse completes, create a small top inset for the scroll indicator for visual clarity
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
    <Animated.ScrollView
      ref={scrollRef}
      style={rContainerStyle}
      className="bg-neutral-950"
      // Content starts below header; +16 gives breathing room before LargeTitle
      contentContainerStyle={{ paddingTop: headerHeight + 16 }}
      contentContainerClassName="p-5"
      indicatorStyle="white"
      scrollIndicatorInsets={rScrollIndicatorInsets}
      // ~60fps; smooth without flooding
      scrollEventThrottle={1000 / 60}
      onScroll={scrollHandler}
    >
      <LargeTitle
        title="Updates"
        offsetY={offsetY}
        // Pass collapse distance so LargeTitle cross-fades exactly when search fully clears the header
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
  );
}

// whatsapp-updates-screen-header-animation 🔼
