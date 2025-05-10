import React, { FC, useRef } from "react";
import { useHeaderMeasurements } from "react-native-collapsible-tab-view";
import Animated, { LinearTransition, useAnimatedScrollHandler } from "react-native-reanimated";
import { useTabsScreenAnimated } from "../../lib/providers/tabs-screen-animated-provider";
import { TabName } from "../../lib/types";
import { useUpdateOffsetOnTabChange } from "../../lib/hooks/use-update-offset-on-tab-change";
import { useFooterHeight } from "../../lib/hooks/use-footer-height";
import TabItem from "./tab-item";
import { useTabsStore } from "../../lib/store/tabs";

export const Incognito: FC = () => {
  const scrollRef = useRef<Animated.ScrollView>(null);

  const data = useTabsStore.use.incognitoTabData();
  const activeTabItemId = useTabsStore.use.incognitoTabActiveTabItemId();
  const setActiveTabItemId = useTabsStore.use.setIncognitoTabActiveTabItemId();
  const removeTabItem = useTabsStore.use.removeTabItem();

  const { height } = useHeaderMeasurements();

  const { grossHeight, scrollViewPaddingBottom } = useFooterHeight();

  const { offsetY, setFocusedTabContentHeight } = useTabsScreenAnimated();

  const { lastOffsetY } = useUpdateOffsetOnTabChange(TabName.Incognito);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      offsetY.value = event.contentOffset.y;
      lastOffsetY.value = offsetY.value;
    },
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      contentContainerClassName="gap-4"
      contentContainerStyle={{
        paddingTop: height + 16,
        paddingBottom: grossHeight + scrollViewPaddingBottom,
      }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ top: height + 16, bottom: grossHeight + scrollViewPaddingBottom }}
      onContentSizeChange={(_, h) => {
        setFocusedTabContentHeight(TabName.Incognito, h);
        scrollRef.current?.scrollToEnd({ animated: true });
      }}
    >
      <Animated.View className="flex-row flex-wrap" layout={LinearTransition}>
        {data.map((item, index) => (
          <TabItem
            key={item.id}
            index={index}
            isActive={activeTabItemId === item.id}
            activeColor="#d4d4d4"
            onItemPress={() => setActiveTabItemId(item.id)}
            onRemovePress={() => removeTabItem(TabName.Incognito, item.id)}
          />
        ))}
      </Animated.View>
    </Animated.ScrollView>
  );
};
