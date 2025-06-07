import { ScrollDirection, useScrollDirection } from "@/src/shared/lib/hooks/use-scroll-direction";
import { createContext, FC, PropsWithChildren, RefObject, useContext, useRef } from "react";
import { FlatList } from "react-native";
import {
  runOnJS,
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useHomeHeaderHeight } from "../hooks/use-home-header-height";

type ContextValue = {
  listRef: RefObject<FlatList<any> | null>;
  headerTop: SharedValue<number>;
  offsetY: SharedValue<number>;
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
  scrollDirection: SharedValue<ScrollDirection>;
  offsetYAnchorOnChangeDirection: SharedValue<number>;
};

const AnimatedScrollContext = createContext<ContextValue>({} as ContextValue);

export const AnimatedScrollProvider: FC<PropsWithChildren> = ({ children }) => {
  const { netHeaderHeight } = useHomeHeaderHeight();

  const listRef = useRef<FlatList<any> | null>(null);

  const headerTop = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const handleListScrollEndDrag = (offsetYValue: number) => {
    listRef.current?.scrollToOffset({
      offset: offsetYValue,
      animated: true,
    });
  };

  const {
    onScroll: directionOnScroll,
    scrollDirection,
    offsetYAnchorOnChangeDirection,
  } = useScrollDirection();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      offsetY.set(event.contentOffset.y);
      directionOnScroll(event);
    },
    onEndDrag: (event) => {
      const isHeaderVisible =
        Math.abs(headerTop.get()) > 0 && Math.abs(headerTop.get()) < netHeaderHeight;

      if (scrollDirection.get() === "to-bottom" && isHeaderVisible) {
        const targetScrollOffset =
          event.contentOffset.y + (netHeaderHeight - Math.abs(headerTop.get()) + 5);
        runOnJS(handleListScrollEndDrag)(targetScrollOffset);
      }
      if (scrollDirection.get() === "to-top" && isHeaderVisible) {
        const targetScrollOffset = event.contentOffset.y - netHeaderHeight - 5;
        runOnJS(handleListScrollEndDrag)(targetScrollOffset);
      }
    },
  });

  const value: ContextValue = {
    listRef,
    headerTop,
    offsetY,
    scrollHandler,
    scrollDirection,
    offsetYAnchorOnChangeDirection,
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
