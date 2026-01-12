// juventus-games-calendar-animation 🔽

import { createContext, type PropsWithChildren } from "react";
import Animated, {
  useAnimatedRef,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { MONTHS_LENGTH } from "./constants";

/**
 * Context type for sharing animated values across calendar components.
 * Contains shared values for scroll progress and animation coordination
 * to enable synchronized animations without prop drilling.
 */
type CalendarAnimatedContextType = {
  // Continuous progress value: 0 = first month, 1 = second month, etc.
  // Used for interpolations across all animated components
  activeIndexProgress: SharedValue<number>;
  // Raw scroll offset in pixels - tracks exact scroll position
  scrollOffsetX: SharedValue<number>;
  // Dynamic widths array - each index stores measured width of corresponding month label
  // Updated via onLayout to handle variable text widths (e.g., "September" vs "May")
  monthWidths: SharedValue<number[]>;
  // Animated ref for programmatic scrolling to specific month index
  scrollViewRef: ReturnType<typeof useAnimatedRef<Animated.ScrollView>>;
};

export const CalendarAnimatedContext = createContext<CalendarAnimatedContextType>(
  {} as CalendarAnimatedContextType
);

export const CalendarAnimatedProvider = ({ children }: PropsWithChildren) => {
  // Initialize with zeros - widths populated dynamically via onLayout measurements
  // Array length matches MONTHS_LENGTH to ensure index alignment
  const monthWidths = useSharedValue<number[]>(new Array(MONTHS_LENGTH).fill(0));

  // Raw pixel offset from scroll - used for precise scroll tracking
  const scrollOffsetX = useSharedValue(0);
  // Normalized progress (0-based index + fractional scroll within page)
  // Calculated as offsetX / screenWidth in scroll handler
  const activeIndexProgress = useSharedValue(0);
  // Ref for Animated.ScrollView - enables programmatic scrolling from worklets
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const contextValue: CalendarAnimatedContextType = {
    activeIndexProgress,
    scrollOffsetX,
    monthWidths,
    scrollViewRef,
  };

  return (
    <CalendarAnimatedContext.Provider value={contextValue}>
      {children}
    </CalendarAnimatedContext.Provider>
  );
};

// juventus-games-calendar-animation 🔼
