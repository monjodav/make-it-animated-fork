import React, { FC } from "react";
import { View } from "react-native";
import { useHeaderMeasurements } from "react-native-collapsible-tab-view";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useTabsScreenAnimated } from "../../lib/providers/tabs-screen-animated-provider";
import { useUpdateOffsetOnTabChange } from "../../lib/hooks/use-update-offset-on-tab-change";
import { TabName } from "../../lib/types";
import { useFooterHeight } from "../../lib/hooks/use-footer-height";

export const Groups: FC = () => {
  const { height } = useHeaderMeasurements();

  const { grossHeight, scrollViewPaddingBottom } = useFooterHeight();

  const { offsetY, setFocusedTabContentHeight } = useTabsScreenAnimated();

  const { lastOffsetY } = useUpdateOffsetOnTabChange(TabName.Groups);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      offsetY.value = event.contentOffset.y;
      lastOffsetY.value = offsetY.value;
    },
  });

  return (
    <Animated.ScrollView
      contentContainerClassName="p-5"
      contentContainerStyle={{
        paddingTop: height + 16,
        paddingBottom: grossHeight + scrollViewPaddingBottom,
      }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ top: height + 16, bottom: grossHeight + scrollViewPaddingBottom }}
      onContentSizeChange={(_, h) => {
        setFocusedTabContentHeight(TabName.Groups, h);
      }}
    >
      <View className="h-20 w-full rounded-xl bg-neutral-900 mb-8" />
    </Animated.ScrollView>
  );
};
