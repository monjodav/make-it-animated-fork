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

export const Main: FC = () => {
  const scrollRef = useRef<Animated.ScrollView>(null);

  const data = useTabsStore.use.mainTabData();
  const activeTabItemId = useTabsStore.use.mainTabActiveTabItemId();
  const setActiveTabItemId = useTabsStore.use.setMainTabActiveTabItemId();
  const removeTabItem = useTabsStore.use.removeTabItem();

  // Header measurements from collapsible-tab-view. We pad the ScrollView by this
  // gross header height so the grid begins below the dynamic header.
  const { height } = useHeaderMeasurements();

  // Footer spacing: accounts for bottom tabs/safe-inset. Using grossHeight +
  // scrollViewPaddingBottom prevents the last row from being obscured.
  const { grossHeight, scrollViewPaddingBottom } = useFooterHeight();

  // Shared animated state across tabs screen. offsetY is the live scroll position
  // (UI thread), setFocusedTabContentHeight informs parent about content size for
  // header/footer coordination.
  const { offsetY, setFocusedTabContentHeight } = useTabsScreenAnimated();

  // Keep a per-tab memory of the last scroll offset so switching tabs restores
  // context and avoids jarring jumps.
  const { lastOffsetY } = useUpdateOffsetOnTabChange(TabName.Main);

  // Run on UI thread for 60fps. We mirror offset to lastOffsetY to persist
  // scroll position across tab changes.
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
        // 16px: breathing room under header; matches grid spacing rhythm.
        paddingTop: height + 16,
        // Ensures last row stays above bottom UI. Combines footer and extra pad.
        paddingBottom: grossHeight + scrollViewPaddingBottom,
      }}
      onScroll={scrollHandler}
      // 16ms ~ 60fps. Keeps scroll-driven animations responsive without
      // overwhelming the JS bridge; handler runs on UI thread.
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ top: height + 16, bottom: grossHeight + scrollViewPaddingBottom }}
      onContentSizeChange={(_, h) => {
        // Inform parent about content height for proper header/footer behavior.
        // Auto-scroll to end to reveal most recent tabs when content grows.
        setFocusedTabContentHeight(TabName.Main, h);
        scrollRef.current?.scrollToEnd({ animated: true });
      }}
    >
      {/* Grid container uses Reanimated layout to animate item reflows when
          tabs are added/removed or when active highlight changes size. */}
      <Animated.View className="flex-row flex-wrap" layout={LinearTransition}>
        {data.map((item, index) => (
          <TabItem
            key={item.id}
            index={index}
            isActive={activeTabItemId === item.id}
            onItemPress={() => setActiveTabItemId(item.id)}
            onRemovePress={() => removeTabItem(TabName.Main, item.id)}
          />
        ))}
      </Animated.View>
    </Animated.ScrollView>
  );
};

// google-chrome-tab-item-layout-animation 🔼
