import type { FC, PropsWithChildren } from "react";
import React, { createContext, useState } from "react";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { ReanimatedScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// x-bottom-tabs-background-animation 🔽

const TAB_BAR_HEIGHT_WITHOUT_INSET = 30;

interface XTabsContextValue {
  tabBarHeight: number;
  tabBarPaddingBottom: number;
  isBottomBlurVisible: boolean;
  setIsBottomBlurVisible: (isBottomBlurVisible: boolean) => void;
  isAddButtonVisible: boolean;
  setIsAddButtonVisible: (isAddButtonVisible: boolean) => void;
  handleMomentumBegin: (e: ReanimatedScrollEvent) => void;
  handleScroll: (e: ReanimatedScrollEvent) => void;
}

export const XTabsContext = createContext<XTabsContextValue>({} as XTabsContextValue);

export const XTabsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isBottomBlurVisible, setIsBottomBlurVisible] = useState(true);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);

  const insets = useSafeAreaInsets();

  const tabBarPaddingBottom = insets.bottom + 16;
  const tabBarHeight = tabBarPaddingBottom + TAB_BAR_HEIGHT_WITHOUT_INSET;

  const offsetYRefPoint = useSharedValue(0);

  const handleMomentumBegin = (e: ReanimatedScrollEvent) => {
    "worklet";

    offsetYRefPoint.value = e.contentOffset.y;
  };

  const handleScroll = (e: ReanimatedScrollEvent) => {
    "worklet";

    if (offsetYRefPoint.value < 0) return;

    const isScrollingToBottom = e.contentOffset.y > offsetYRefPoint.value;
    const isScrollingToTop = e.contentOffset.y < offsetYRefPoint.value;

    if (isScrollingToBottom) {
      runOnJS(setIsBottomBlurVisible)(false);
    } else if (isScrollingToTop) {
      runOnJS(setIsBottomBlurVisible)(true);
    }
  };

  const value = {
    tabBarHeight,
    tabBarPaddingBottom,
    isBottomBlurVisible,
    setIsBottomBlurVisible,
    isAddButtonVisible,
    setIsAddButtonVisible,
    handleMomentumBegin,
    handleScroll,
  };

  return <XTabsContext.Provider value={value}>{children}</XTabsContext.Provider>;
};

// x-bottom-tabs-background-animation 🔼
