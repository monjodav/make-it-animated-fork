import { useSafeAreaInsets } from "react-native-safe-area-context";

// google-chrome-footer-animation 🔽

export const useFooterHeight = () => {
  const insets = useSafeAreaInsets();

  const height = 40;
  const scrollViewPaddingBottom = 16;

  return {
    bottomInset: insets.bottom,
    netHeight: height,
    grossHeight: insets.bottom + height,
    scrollViewPaddingBottom,
  };
};

// google-chrome-footer-animation 🔼
