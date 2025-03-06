import { useSafeAreaInsets } from "react-native-safe-area-context";

// gmail-header-scroll-animation 🔽

export const useHeaderHeight = () => {
  const insets = useSafeAreaInsets();

  const safeAreaHeight = insets.top + 8;
  const searchBarHeight = 48;
  const headerHeight = safeAreaHeight + searchBarHeight;

  return {
    safeAreaHeight,
    searchBarHeight,
    headerHeight,
  };
};

// gmail-header-scroll-animation 🔼
