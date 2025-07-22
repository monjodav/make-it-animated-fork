import { useSafeAreaInsets } from "react-native-safe-area-context";

// gmail-header-scroll-animation 🔽

// Header height calculations for Gmail's animated header system
// Provides consistent spacing values across all animated components
// Ensures proper content offset and animation range calculations
export const useHeaderHeight = () => {
  const insets = useSafeAreaInsets();

  // Safe area height: status bar/notch + 8px padding for visual breathing room
  // The 8px prevents content from touching the status bar edge
  const safeAreaHeight = insets.top + 8;

  // Search bar height: 48px matches standard iOS/Material Design input field height
  // This constant drives all header animation interpolation ranges
  const searchBarHeight = 48;

  // Total header height: combines safe area + search bar for content offset calculations
  // Used by ContentList to prevent content overlap with fixed header
  const headerHeight = safeAreaHeight + searchBarHeight;

  return {
    safeAreaHeight, // For background overlay height
    searchBarHeight, // For animation interpolation ranges
    headerHeight, // For content paddingTop offset
  };
};

// gmail-header-scroll-animation 🔼
