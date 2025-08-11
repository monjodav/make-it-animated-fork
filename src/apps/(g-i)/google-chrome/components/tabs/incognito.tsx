import React, { FC, useRef } from "react";
import { useHeaderMeasurements } from "react-native-collapsible-tab-view";
import Animated, { LinearTransition, useAnimatedScrollHandler } from "react-native-reanimated";
import { useTabsScreenAnimated } from "../../lib/providers/tabs-screen-animated-provider";
import { TabName } from "../../lib/types";
import { useUpdateOffsetOnTabChange } from "../../lib/hooks/use-update-offset-on-tab-change";
import { useFooterHeight } from "../../lib/hooks/use-footer-height";
import TabItem from "./tab-item";
import { useTabsStore } from "../../lib/store/tabs";

// google-chrome-tab-item-layout-animation 🔽

export const Incognito: FC = () => {
  const scrollRef = useRef<Animated.ScrollView>(null);

  const data = useTabsStore.use.incognitoTabData();
  const activeTabItemId = useTabsStore.use.incognitoTabActiveTabItemId();
  const setActiveTabItemId = useTabsStore.use.setIncognitoTabActiveTabItemId();
  const removeTabItem = useTabsStore.use.removeTabItem();

  // Dynamic header height from collapsible-tab-view. We pad the grid so first row
  // doesn't slide under the header while it reveals/collapses.
  const { height } = useHeaderMeasurements();

  // Footer spacing protects the last row from being hidden behind bottom UI.
  const { grossHeight, scrollViewPaddingBottom } = useFooterHeight();

  // Shared animated values across Tabs screen. offsetY lives on the UI thread and
  // drives any header reactions; setFocusedTabContentHeight informs parent layout.
  const { offsetY, setFocusedTabContentHeight } = useTabsScreenAnimated();

  // Persist last scroll offset for this tab so returning to it restores position.
  const { lastOffsetY } = useUpdateOffsetOnTabChange(TabName.Incognito);

  // UI-thread handler keeps scroll-linked work at 60fps. We mirror the live
  // offset into lastOffsetY for cross-tab restoration.
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
        // 16px: consistent rhythm under header; matches grid spacing.
        paddingTop: height + 16,
        // Keep last row above bottom chrome. Combines footer height + extra pad.
        paddingBottom: grossHeight + scrollViewPaddingBottom,
      }}
      onScroll={scrollHandler}
      // 16ms ~ 60fps updates while keeping bridge pressure low.
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ top: height + 16, bottom: grossHeight + scrollViewPaddingBottom }}
      onContentSizeChange={(_, h) => {
        // Report content height for parent coordination. Auto-scroll to end so
        // newly opened incognito tabs are revealed immediately.
        setFocusedTabContentHeight(TabName.Incognito, h);
        scrollRef.current?.scrollToEnd({ animated: true });
      }}
    >
      {/* Grid reflows are animated via Reanimated layout for smooth position
          changes when items are added/removed. */}
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

// google-chrome-tab-item-layout-animation 🔼
