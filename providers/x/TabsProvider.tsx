import type { FC, PropsWithChildren } from "react";
import React, { createContext, useState } from "react";

interface TabsContextValue {
  isBottomBlurVisible: boolean;
  setIsBottomBlurVisible: (isBottomBlurVisible: boolean) => void;
}

const defaultContextValue: TabsContextValue = {
  isBottomBlurVisible: false,
  setIsBottomBlurVisible: () => {},
};

export const TabsContext = createContext<TabsContextValue>(defaultContextValue);

export const TabsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isBottomBlurVisible, setIsBottomBlurVisible] = useState(true);

  const value = {
    isBottomBlurVisible,
    setIsBottomBlurVisible,
  };

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};
