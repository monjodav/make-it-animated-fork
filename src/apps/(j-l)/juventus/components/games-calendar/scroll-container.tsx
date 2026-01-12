// juventus-games-calendar-animation 🔽

import React, { FC, PropsWithChildren } from "react";
import { useWindowDimensions } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { CalendarAnimatedContext } from "../../lib/animated-context";
import { use } from "react";
import { DAYS_HEADER_HEIGHT, MONTHS_HEIGHT } from "../../lib/constants";

export const ScrollContainer: FC<PropsWithChildren> = ({ children }) => {
  const { scrollOffsetX, activeIndexProgress, isMonthPressed, scrollViewRef } =
    use(CalendarAnimatedContext);

  const { width: screenWidth } = useWindowDimensions();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetX = event.contentOffset.x;
      scrollOffsetX.set(offsetX);
      if (!isMonthPressed.get()) {
        activeIndexProgress.set(offsetX / screenWidth);
      }
    },
  });

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      pagingEnabled
      decelerationRate="fast"
      contentContainerStyle={{ paddingTop: MONTHS_HEIGHT + DAYS_HEADER_HEIGHT }}
    >
      {children}
    </Animated.ScrollView>
  );
};

// juventus-games-calendar-animation 🔼
