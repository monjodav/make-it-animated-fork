import type { FC, PropsWithChildren } from "react";
import React, { createContext, useState } from "react";

interface XTabsContextValue {
  isBottomBlurVisible: boolean;
  setIsBottomBlurVisible: (isBottomBlurVisible: boolean) => void;
  isAddButtonVisible: boolean;
  setIsAddButtonVisible: (isAddButtonVisible: boolean) => void;
}

export const XTabsContext = createContext<XTabsContextValue>({} as XTabsContextValue);

export const XTabsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isBottomBlurVisible, setIsBottomBlurVisible] = useState(true);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);

  const value = {
    isBottomBlurVisible,
    setIsBottomBlurVisible,
    isAddButtonVisible,
    setIsAddButtonVisible,
  };

  return <XTabsContext.Provider value={value}>{children}</XTabsContext.Provider>;
};
