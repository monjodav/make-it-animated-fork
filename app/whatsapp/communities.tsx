import React from "react";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { LargeTitle } from "@/components/whatsapp/large-title";
import { CommunitiesContent } from "@/components/whatsapp/communities-content";

export default function Communities() {
  const headerHeight = useHeaderHeight();

  const offsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y;
    },
  });

  return (
    <Animated.ScrollView
      className="bg-neutral-950"
      contentContainerStyle={{ paddingTop: headerHeight + 16 }}
      contentContainerClassName="p-5"
      indicatorStyle="white"
      scrollEventThrottle={1000 / 60}
      onScroll={scrollHandler}
    >
      <LargeTitle title="Communities" offsetY={offsetY} className="mb-8" />
      <CommunitiesContent offsetY={offsetY} />
    </Animated.ScrollView>
  );
}
