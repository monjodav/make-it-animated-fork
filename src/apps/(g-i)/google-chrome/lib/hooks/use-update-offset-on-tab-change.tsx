import { useEffect } from "react";
import { useFocusedTab } from "react-native-collapsible-tab-view";
import { useTabsScreenAnimated } from "../providers/tabs-screen-animated-provider";
import { TabName } from "../types";
import { useSharedValue } from "react-native-reanimated";

export const useUpdateOffsetOnTabChange = (tabName: TabName) => {
  const focusedTab = useFocusedTab();

  const { offsetY } = useTabsScreenAnimated();

  const lastOffsetY = useSharedValue(0);

  useEffect(() => {
    if (focusedTab === tabName) {
      offsetY.value = lastOffsetY.value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedTab]);

  return {
    lastOffsetY,
  };
};
