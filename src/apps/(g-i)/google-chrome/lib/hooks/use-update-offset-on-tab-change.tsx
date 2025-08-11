import { useEffect } from "react";
import { useFocusedTab } from "react-native-collapsible-tab-view";
import { useTabsScreenAnimated } from "../providers/tabs-screen-animated-provider";
import { TabName } from "../types";
import { useSharedValue } from "react-native-reanimated";

// google-chrome-header-background-animation 🔽

// Keeps the shared scroll offset (offsetY) in sync when switching tabs.
// WHY: Restoring the last per-tab scroll position preserves header/footer animation states
// (e.g., header background and footer blur) so they don't jump when the user returns to a tab.
export const useUpdateOffsetOnTabChange = (tabName: TabName) => {
  const focusedTab = useFocusedTab();

  const { offsetY } = useTabsScreenAnimated();

  // Stores the last known scroll offset for the given tab.
  // Read/written by scroll handlers externally; we only restore into offsetY on focus.
  const lastOffsetY = useSharedValue(0);

  // On tab focus, push the tab's last offset into the shared offsetY so all
  // dependent animations (header bg, footer blur) immediately reflect the correct state.
  // Integration detail: useFocusedTab comes from react-native-collapsible-tab-view,
  // which coordinates which tab is active across the collapsible header layout.
  useEffect(() => {
    if (focusedTab === tabName) {
      offsetY.set(lastOffsetY.get());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Intentionally depend only on focusedTab to avoid re-applying offset while offsetY/lastOffsetY change.
    // Re-applying would cause unnecessary UI-thread writes and potential flicker.
  }, [focusedTab]);

  return {
    lastOffsetY,
  };
};

// google-chrome-header-background-animation 🔼
