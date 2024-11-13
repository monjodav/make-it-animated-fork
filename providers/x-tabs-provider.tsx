import { usePathname } from "expo-router";
import type { FC, PropsWithChildren } from "react";
import React, { createContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_HEIGHT_WITHOUT_INSET = 30;

interface XTabsContextValue {
  tabBarHeight: number;
  tabBarPaddingBottom: number;
  isBottomBlurVisible: boolean;
  setIsBottomBlurVisible: (isBottomBlurVisible: boolean) => void;
  isAddButtonVisible: boolean;
  setIsAddButtonVisible: (isAddButtonVisible: boolean) => void;
}

export const XTabsContext = createContext<XTabsContextValue>({} as XTabsContextValue);

export const XTabsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isBottomBlurVisible, setIsBottomBlurVisible] = useState(true);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);

  const insets = useSafeAreaInsets();

  const pathname = usePathname();

  useEffect(() => {
    setIsBottomBlurVisible(true);
  }, [pathname]);

  const tabBarPaddingBottom = insets.bottom + 16;
  const tabBarHeight = tabBarPaddingBottom + TAB_BAR_HEIGHT_WITHOUT_INSET;

  const value = {
    tabBarHeight,
    tabBarPaddingBottom,
    isBottomBlurVisible,
    setIsBottomBlurVisible,
    isAddButtonVisible,
    setIsAddButtonVisible,
  };

  return <XTabsContext.Provider value={value}>{children}</XTabsContext.Provider>;
};
