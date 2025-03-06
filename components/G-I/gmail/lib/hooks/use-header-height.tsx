import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useHeaderHeight = () => {
  const insets = useSafeAreaInsets();

  const safeAreaHeight = insets.top + 8;
  const searchBarHeight = 44;
  const headerHeight = safeAreaHeight + searchBarHeight;

  return {
    safeAreaHeight,
    searchBarHeight,
    headerHeight,
  };
};
