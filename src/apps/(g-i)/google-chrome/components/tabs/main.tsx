import React, { FC } from "react";
import { useHeaderMeasurements } from "react-native-collapsible-tab-view";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useTabsScreenAnimated } from "../../lib/providers/tabs-screen-animated-provider";
import { TabName } from "../../lib/types";
import { useUpdateOffsetOnTabChange } from "../../lib/hooks/use-update-offset-on-tab-change";
import { useFooterHeight } from "../../lib/hooks/use-footer-height";
import { TabItem } from "./tab-item";

export const Main: FC = () => {
  const { height } = useHeaderMeasurements();

  const { grossHeight, scrollViewPaddingBottom } = useFooterHeight();

  const { offsetY, setFocusedTabContentHeight } = useTabsScreenAnimated();

  const { lastOffsetY } = useUpdateOffsetOnTabChange(TabName.Main);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      offsetY.value = event.contentOffset.y;
      lastOffsetY.value = offsetY.value;
    },
  });

  return (
    <Animated.FlatList
      data={[1, 2, 3, 4, 5]}
      renderItem={({ item, index }) => <TabItem index={index} isActive={index === 2} />}
      horizontal={false}
      numColumns={2}
      contentContainerClassName="gap-4"
      contentContainerStyle={{
        paddingTop: height + 16,
        paddingBottom: grossHeight + scrollViewPaddingBottom,
      }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ top: height + 16, bottom: grossHeight + scrollViewPaddingBottom }}
      onContentSizeChange={(_, h) => {
        setFocusedTabContentHeight(TabName.Main, h);
      }}
    />
  );
};
