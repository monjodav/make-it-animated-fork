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
      <View className="p-4 w-full rounded-2xl bg-neutral-900 mb-8">
        <View className="flex-row items-center gap-2">
          <View className="w-14 h-14 rounded-xl bg-neutral-950" />
          <View>
            <View className="h-5 w-20 bg-neutral-800/75 rounded-full" />
            <View className="h-3 w-40 bg-neutral-800/75 rounded-full mt-2" />
          </View>
        </View>
      </View>
    </Animated.ScrollView>
  );
};
