import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useBottomTabBarHeight = () => {
  const insets = useSafeAreaInsets();

  return {
    netHeight: 60,
    grossHeight: insets.bottom + 60,
  };
};
