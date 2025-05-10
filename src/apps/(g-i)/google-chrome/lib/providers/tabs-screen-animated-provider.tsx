import { createContext, FC, PropsWithChildren, useCallback, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { TabName } from "../types";

type ContextValue = {
  offsetY: SharedValue<number>;
  contentHeight: SharedValue<Record<TabName, number>>;
  setFocusedTabContentHeight: (tabName: TabName, height: number) => void;
};

const TabsScreenAnimatedContext = createContext<ContextValue>({} as ContextValue);

export const TabsScreenAnimatedProvider: FC<PropsWithChildren> = ({ children }) => {
  const offsetY = useSharedValue(0);
  const contentHeight = useSharedValue<Record<TabName, number>>({
    [TabName.Incognito]: 0,
    [TabName.Main]: 0,
    [TabName.Groups]: 0,
  });

  const setFocusedTabContentHeight = useCallback(
    (tabName: TabName, height: number) => {
      contentHeight.modify((value) => {
        "worklet";
        value[tabName] = height;
        return value;
      });
    },
    [contentHeight]
  );

  const value = { offsetY, contentHeight, setFocusedTabContentHeight };

  return (
    <TabsScreenAnimatedContext.Provider value={value}>
      {children}
    </TabsScreenAnimatedContext.Provider>
  );
};

export const useTabsScreenAnimated = () => {
  const context = useContext(TabsScreenAnimatedContext);

  if (!context) {
    throw new Error("useTabsScreenAnimated must be used within an TabsScreenAnimatedProvider");
  }

  return context;
};
