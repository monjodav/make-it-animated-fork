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
  // google-chrome-header-background-animation 🔽
  // google-chrome-footer-animation 🔽
  // Scroll offset shared across the tabs screen.
  // WHY: Drives both header/background and footer blur logic in sync at 60fps on the UI thread.
  const offsetY = useSharedValue(0);
  // google-chrome-footer-animation 🔼
  // google-chrome-header-background-animation 🔼

  // google-chrome-footer-animation 🔽
  // Per-tab content heights are stored as a shared value so dependent animations
  // (e.g., footer blur visibility) can read them in worklets without bridging to JS.
  const contentHeight = useSharedValue<Record<TabName, number>>({
    [TabName.Incognito]: 0,
    [TabName.Main]: 0,
    [TabName.Groups]: 0,
  });

  // Mutate shared map on the UI thread.
  // WHY: Using modify() keeps updates synchronous for worklets; returning the object preserves reference.
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
  // google-chrome-footer-animation 🔼

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
