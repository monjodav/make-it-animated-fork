import {
  ScrollDirectionValue,
  useScrollDirection,
} from "@/src/shared/lib/hooks/use-scroll-direction";
import { createContext, FC, PropsWithChildren, useContext, useRef } from "react";
import { FlatList } from "react-native";
import {
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

// gmail-header-scroll-animation 🔽
// gmail-bottom-tab-bar-and-fab-animation 🔽

// Centralized animation state provider for Gmail's coordinated scroll animations
// Manages shared values between header, bottom tab bar, and FAB components
// Provides unified scroll handling and direction detection for consistent UX
type AnimatedScrollListContextType = {
  listRef: React.RefObject<FlatList<any> | null>; // Ref for programmatic scroll control
  listOffsetY: SharedValue<number>; // Real-time scroll position for interpolations
  isDragging: SharedValue<boolean>; // Prevents auto-scroll during user interaction
  scrollDirection: ScrollDirectionValue; // Current scroll direction (to-top/to-bottom/idle)
  offsetYAnchorOnBeginDrag: SharedValue<number>; // Touch start position for drag calculations
  offsetYAnchorOnChangeDirection: SharedValue<number>; // Position where direction changed
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>; // Optimized scroll event handler
};

const AnimatedScrollListContext = createContext<AnimatedScrollListContextType>(
  {} as AnimatedScrollListContextType
);

export const AnimatedScrollListProvider: FC<PropsWithChildren> = ({ children }) => {
  // FlatList reference for programmatic scrolling (header snapping behavior)
  const listRef = useRef<FlatList>(null);

  // Core animation state - shared across all animated components
  const listOffsetY = useSharedValue(0); // Drives all scroll-based interpolations
  const isDragging = useSharedValue(false); // Prevents conflicts during user interaction

  // Direction detection system - provides reactive scroll direction tracking
  // Returns worklet handlers for optimal UI thread performance
  const {
    scrollDirection, // Shared value: "to-top" | "to-bottom" | "idle"
    offsetYAnchorOnBeginDrag, // Anchor point when user starts dragging
    offsetYAnchorOnChangeDirection, // Anchor point when direction changes
    onBeginDrag: scrollDirectionOnBeginDrag, // Worklet: captures initial touch position
    onScroll: scrollDirectionOnScroll, // Worklet: updates direction on scroll
  } = useScrollDirection();

  // Unified scroll handler - coordinates all animation systems
  // Runs on UI thread for 60fps performance across all components
  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (e) => {
      isDragging.value = true; // Disable auto-scroll during user interaction
      scrollDirectionOnBeginDrag(e); // Capture initial touch position
    },
    onScroll: (e) => {
      listOffsetY.value = e.contentOffset.y; // Update position for all interpolations
      scrollDirectionOnScroll(e); // Update direction detection algorithm
    },
    onEndDrag: () => {
      isDragging.value = false; // Re-enable auto-scroll after user interaction
    },
  });

  return (
    <AnimatedScrollListContext.Provider
      value={{
        listRef,
        listOffsetY,
        isDragging,
        scrollDirection,
        offsetYAnchorOnBeginDrag,
        offsetYAnchorOnChangeDirection,
        scrollHandler,
      }}
    >
      {children}
    </AnimatedScrollListContext.Provider>
  );
};

// Hook for accessing centralized animation state
// Provides type-safe access to shared scroll values and handlers
// Used by header, bottom tab bar, and FAB components for coordinated animations
export const useAnimatedScrollList = () => {
  const context = useContext(AnimatedScrollListContext);

  if (!context) {
    throw new Error("useAnimatedScrollList must be used within an AnimatedScrollListProvider");
  }

  return context;
};

// gmail-bottom-tab-bar-and-fab-animation 🔼
// gmail-header-scroll-animation 🔼
