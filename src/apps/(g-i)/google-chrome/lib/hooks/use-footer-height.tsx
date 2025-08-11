import { useSafeAreaInsets } from "react-native-safe-area-context";

// google-chrome-footer-animation 🔽

export const useFooterHeight = () => {
  const insets = useSafeAreaInsets();

  // Fixed toolbar height chosen to match Chrome's compact bottom controls.
  // 40px yields comfortable hit targets without consuming excessive vertical space.
  const height = 40;
  // Extra bottom padding for scroll views that sit behind the footer.
  // Used in blur visibility math to decide when content exists under the footer while scrolling.
  const scrollViewPaddingBottom = 16;

  return {
    // Pass-through device inset so footer aligns with hardware home indicator.
    bottomInset: insets.bottom,
    // Net height: only the visible toolbar area, used to size the content row.
    netHeight: height,
    // Gross height: toolbar + bottom inset, useful when reserving space in layouts.
    grossHeight: insets.bottom + height,
    // Consumed by footer to compute "screenHeightWithoutFooter" for blur toggling.
    scrollViewPaddingBottom,
  };
};

// google-chrome-footer-animation 🔼
