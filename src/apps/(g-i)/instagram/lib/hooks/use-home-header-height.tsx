import { useSafeAreaInsets } from "react-native-safe-area-context";

// Calculates header dimensions accounting for device safe areas
export const useHomeHeaderHeight = () => {
  const insets = useSafeAreaInsets();

  const topSafeAreaHeight = insets.top; // Dynamic notch/status bar height
  const netHeaderHeight = 50; // Actual header content height (consistent across devices)
  const grossHeaderHeight = netHeaderHeight + topSafeAreaHeight; // Total header space including safe area

  return {
    topSafeAreaHeight, // For layout spacing above header
    netHeaderHeight, // For animation calculations (scroll distances, interpolation ranges)
    grossHeaderHeight, // For total header height including device-specific safe areas
  };
};
