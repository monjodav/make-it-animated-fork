// juventus-games-calendar-animation 🔽

import React, { FC, PropsWithChildren } from "react";
import { useWindowDimensions } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { CalendarAnimatedContext } from "../../lib/animated-context";
import { use } from "react";
import { DAYS_HEADER_HEIGHT, MONTHS_HEIGHT } from "../../lib/constants";

export const ScrollContainer: FC<PropsWithChildren> = ({ children }) => {
  const { scrollOffsetX, activeIndexProgress, scrollViewRef } = use(CalendarAnimatedContext);

  const { width: screenWidth } = useWindowDimensions();

  // Scroll handler runs on UI thread - updates shared values without JS thread overhead
  // scrollEventThrottle={16} ensures 60fps updates (16ms = 1 frame at 60fps)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetX = event.contentOffset.x;
      scrollOffsetX.set(offsetX);
      // Normalize scroll offset to progress: 0 = first page, 1 = second page, etc.
      activeIndexProgress.set(offsetX / screenWidth);
    },
  });

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}
      // Throttle to 60fps (16ms) - balances smooth animation with performance
      // Lower values disable throttling, higher values reduce update frequency
      scrollEventThrottle={16}
      // Snap to full screen widths - enables page-based navigation
      pagingEnabled
      // Top padding accounts for fixed header (months + day labels)
      // Ensures content doesn't hide behind absolute-positioned headers
      contentContainerStyle={{ paddingTop: MONTHS_HEIGHT + DAYS_HEADER_HEIGHT }}
    >
      {children}
    </Animated.ScrollView>
  );
};

// juventus-games-calendar-animation 🔼
