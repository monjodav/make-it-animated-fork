import { Tab } from "@/components/linear/tab-bar";
import { SharedValue } from "react-native-reanimated";

/**
 * Custom hook to manage tab animation calculations and states
 */
interface TabDimensions {
  width: SharedValue<number>;
  x: SharedValue<number>;
}

interface UseTabAnimationProps {
  sidePadding: number;
  gap: number;
}

export const useTabAnimation = ({ sidePadding, gap }: UseTabAnimationProps) => {
  // Create a map of tab dimensions
  const tabDimensions = new Map<Tab, TabDimensions>();

  // Initialize shared values for each tab
  Object.values(Tab).forEach((tab) => {
    tabDimensions.set(tab, {
      width: useSharedValue(0),
      x: useSharedValue(0),
    });
  });

  // Calculate X positions based on previous tabs
  const calculateTabPositions = () => {
    let currentX = sidePadding;

    Object.values(Tab).forEach((tab) => {
      const dimensions = tabDimensions.get(tab);
      if (dimensions) {
        dimensions.x.value = currentX;
        currentX += dimensions.width.value + gap;
      }
    });
  };

  // Handle layout measurements
  const handleTabLayout = (tab: Tab) => (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    const dimensions = tabDimensions.get(tab);
    if (dimensions) {
      dimensions.width.value = width;
      calculateTabPositions();
    }
  };

  return {
    tabDimensions,
    handleTabLayout,
  };
};
