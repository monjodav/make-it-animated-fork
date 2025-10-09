import { ScrollDirection, useScrollDirection } from "@/src/shared/lib/hooks/use-scroll-direction";
import { createContext, FC, PropsWithChildren, RefObject, useContext, useRef } from "react";
import {
  DerivedValue,
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useHomeHeaderHeight } from "../hooks/use-home-header-height";
import { FlashList } from "@shopify/flash-list";
import { Post } from "../types";
import { scheduleOnRN } from "react-native-worklets";

// instagram-header-on-scroll-animation 🔽

// Centralized scroll animation state shared between header and list components
type ContextValue = {
  headerTop: SharedValue<number>; // Header vertical position (-headerHeight to 0)
  isHeaderVisible: DerivedValue<boolean>; // Derived visibility state for animation decisions
  listRef: RefObject<FlashList<any> | null>; // FlashList ref for programmatic scrolling
  listPointerEvents: SharedValue<boolean>; // Prevents user interaction during auto-scroll
  offsetY: SharedValue<number>; // Current scroll position
  velocityOnEndDrag: SharedValue<number>; // Scroll velocity at drag end for fast-scroll detection
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>; // Optimized scroll event handler
  scrollDirection: SharedValue<ScrollDirection>; // Current scroll direction for animation logic
  offsetYAnchorOnBeginDrag: SharedValue<number>; // Reference point for progressive animations
};

const AnimatedScrollContext = createContext<ContextValue>({} as ContextValue);

export const AnimatedScrollProvider: FC<PropsWithChildren> = ({ children }) => {
  const { netHeaderHeight } = useHomeHeaderHeight();

  const listRef = useRef<FlashList<Post> | null>(null);
  // I need const listPointerEvents to block it on handleListScrollEndDrag fire
  // so I'm sure the list is scrolled on end drag properly
  // Prevents scroll conflicts during programmatic scrolling animations
  const listPointerEvents = useSharedValue(true);

  // I keep the header top property here as I need it not only inside the header component
  // Centralized position state enables coordination between header and list scroll snapping
  const headerTop = useSharedValue(0);
  // Tracks whether header is in visible range (not fully hidden) for animation branching
  const isHeaderVisible = useDerivedValue(
    () => Math.abs(headerTop.get()) >= 0 && Math.abs(headerTop.get()) < netHeaderHeight
  );

  const offsetY = useSharedValue(0);
  // I need velocity to show the header when the user scrolls up fast
  // If velocity is too small I will keep the header hidden
  // Velocity threshold prevents header flickering on gentle scrolls
  const velocityOnEndDrag = useSharedValue(0);

  // Smooth programmatic scroll to snap header position when drag ends mid-transition
  const handleListScrollEndDrag = (offsetYValue: number) => {
    listRef.current?.scrollToOffset({
      offset: offsetYValue,
      animated: true, // Native smooth scrolling for polished UX
    });
    // Re-enable touch after scroll animation completes to prevent conflicts
    setTimeout(() => {
      listPointerEvents.set(true);
    }, 300); // 300ms matches native scroll animation duration
  };

  const {
    onBeginDrag: directionOnBeginDrag,
    onScroll: directionOnScroll,
    scrollDirection,
    offsetYAnchorOnBeginDrag,
  } = useScrollDirection();

  // Optimized scroll handler using Reanimated worklets for 60fps performance
  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (event) => {
      velocityOnEndDrag.set(0); // Reset velocity for new gesture
      directionOnBeginDrag(event);
    },
    onScroll: (event) => {
      const offsetYValue = event.contentOffset.y;
      offsetY.set(offsetYValue); // Update scroll position for interpolations

      directionOnScroll(event); // Track scroll direction changes
    },
    onEndDrag: (event) => {
      velocityOnEndDrag.set(event.velocity?.y ?? 0); // Capture final velocity for header logic

      // Snap header to fully visible/hidden when drag ends in the middle zone (avoids stuck states)
      const headerTopTriggerDistance =
        Math.abs(headerTop.get()) >= 2 && Math.abs(headerTop.get()) < netHeaderHeight - 2;

      // Downward scroll + partial hide: Complete the hide animation
      if (scrollDirection.get() === "to-bottom" && headerTopTriggerDistance) {
        const targetScrollOffset =
          event.contentOffset.y + (netHeaderHeight - Math.abs(headerTop.get()) + 2);
        listPointerEvents.set(false); // Block user touch during snap
        scheduleOnRN(handleListScrollEndDrag, targetScrollOffset);
      }

      // Upward scroll + partial show: Complete the reveal animation
      if (scrollDirection.get() === "to-top" && headerTopTriggerDistance) {
        const targetScrollOffset = event.contentOffset.y - netHeaderHeight - 2;
        listPointerEvents.set(false); // Block user touch during snap
        scheduleOnRN(handleListScrollEndDrag, targetScrollOffset);
      }
    },
  });

  const value: ContextValue = {
    headerTop,
    isHeaderVisible,
    listRef,
    listPointerEvents,
    offsetY,
    velocityOnEndDrag,
    scrollHandler,
    scrollDirection,
    offsetYAnchorOnBeginDrag,
  };

  return <AnimatedScrollContext.Provider value={value}>{children}</AnimatedScrollContext.Provider>;
};

export const useAnimatedScroll = () => {
  const context = useContext(AnimatedScrollContext);

  if (!context) {
    throw new Error("useAnimatedScroll must be used within an AnimatedScrollProvider");
  }

  return context;
};

// instagram-header-on-scroll-animation 🔼
