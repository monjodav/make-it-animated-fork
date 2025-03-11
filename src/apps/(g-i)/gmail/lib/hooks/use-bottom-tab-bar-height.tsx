import { useSafeAreaInsets } from "react-native-safe-area-context";

// gmail-bottom-tab-bar-and-fab-animation 🔽

export const useBottomTabBarHeight = () => {
  const insets = useSafeAreaInsets();

  return {
    netHeight: 60,
    grossHeight: insets.bottom + 60,
  };
};

// gmail-bottom-tab-bar-and-fab-animation 🔼
