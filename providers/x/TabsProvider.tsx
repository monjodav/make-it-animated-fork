import type { FC, PropsWithChildren } from "react";
import React, { createContext, useEffect, useState } from "react";

interface TabsContextValue {
  isBottomBlurVisible: boolean;
  setIsBottomBlurVisible: (isBottomBlurVisible: boolean) => void;
  isAddButtonVisible: boolean;
  setIsAddButtonVisible: (isAddButtonVisible: boolean) => void;
}

export const TabsContext = createContext<TabsContextValue>({} as TabsContextValue);

export const TabsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isBottomBlurVisible, setIsBottomBlurVisible] = useState(true);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);

  const value = {
    isBottomBlurVisible,
    setIsBottomBlurVisible,
    isAddButtonVisible,
    setIsAddButtonVisible,
  };

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};
