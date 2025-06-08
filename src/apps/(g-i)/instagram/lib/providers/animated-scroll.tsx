import { ScrollDirection, useScrollDirection } from "@/src/shared/lib/hooks/use-scroll-direction";
import { createContext, FC, PropsWithChildren, RefObject, useContext, useRef } from "react";
import {
  DerivedValue,
  runOnJS,
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useHomeHeaderHeight } from "../hooks/use-home-header-height";
import { FlashList } from "@shopify/flash-list";
import { Post } from "../types";

// instagram-header-on-scroll-animation 🔽

type ContextValue = {
  headerTop: SharedValue<number>;
  isHeaderVisible: DerivedValue<boolean>;
  listRef: RefObject<FlashList<any> | null>;
  listPointerEvents: SharedValue<boolean>;
  offsetY: SharedValue<number>;
  velocityOnEndDrag: SharedValue<number>;
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
  scrollDirection: SharedValue<ScrollDirection>;
  offsetYAnchorOnBeginDrag: SharedValue<number>;
};

const AnimatedScrollContext = createContext<ContextValue>({} as ContextValue);

export const AnimatedScrollProvider: FC<PropsWithChildren> = ({ children }) => {
  const { netHeaderHeight } = useHomeHeaderHeight();

  const listRef = useRef<FlashList<Post> | null>(null);
  // I need const listPointerEvents to block it on handleListScrollEndDrag fire
  // so I'm sure the list is scrolled on end drag properly
  const listPointerEvents = useSharedValue(true);

  // I keep the header top property here as I need it not only inside the header component
  const headerTop = useSharedValue(0);
  const isHeaderVisible = useDerivedValue(
    () => Math.abs(headerTop.get()) >= 0 && Math.abs(headerTop.get()) < netHeaderHeight
  );

  const offsetY = useSharedValue(0);
  // I need velocity to show the header when the user scrolls up fast
  // If velocity is too small I will keep the header hidden
  const velocityOnEndDrag = useSharedValue(0);

  const handleListScrollEndDrag = (offsetYValue: number) => {
    listRef.current?.scrollToOffset({
      offset: offsetYValue,
      animated: true,
    });
    setTimeout(() => {
      listPointerEvents.set(true);
    }, 300);
  };

  const {
    onBeginDrag: directionOnBeginDrag,
    onScroll: directionOnScroll,
    scrollDirection,
    offsetYAnchorOnBeginDrag,
  } = useScrollDirection();

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (event) => {
      velocityOnEndDrag.set(0);
      directionOnBeginDrag(event);
    },
    onScroll: (event) => {
      const offsetYValue = event.contentOffset.y;
      offsetY.set(offsetYValue);

      directionOnScroll(event);
    },
    onEndDrag: (event) => {
      velocityOnEndDrag.set(event.velocity?.y ?? 0);

      // Here is the logic to move the header in curtain direction in case the user dragged the list
      // just a bit and released
      const headerTopTriggerDistance =
        Math.abs(headerTop.get()) >= 2 && Math.abs(headerTop.get()) < netHeaderHeight - 2;

      if (scrollDirection.get() === "to-bottom" && headerTopTriggerDistance) {
        const targetScrollOffset =
          event.contentOffset.y + (netHeaderHeight - Math.abs(headerTop.get()) + 2);
        listPointerEvents.set(false);
        runOnJS(handleListScrollEndDrag)(targetScrollOffset);
      }

      if (scrollDirection.get() === "to-top" && headerTopTriggerDistance) {
        const targetScrollOffset = event.contentOffset.y - netHeaderHeight - 2;
        listPointerEvents.set(false);
        runOnJS(handleListScrollEndDrag)(targetScrollOffset);
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
