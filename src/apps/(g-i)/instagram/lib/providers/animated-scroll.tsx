import { ScrollDirection, useScrollDirection } from "@/src/shared/lib/hooks/use-scroll-direction";
import { createContext, FC, PropsWithChildren, RefObject, useContext, useRef } from "react";
import { FlatList } from "react-native";
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

type ContextValue = {
  listRef: RefObject<FlatList<any> | null>;
  headerTop: SharedValue<number>;
  isHeaderVisible: DerivedValue<boolean>;
  offsetY: SharedValue<number>;
  velocityYonEndDrag: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
  scrollDirection: SharedValue<ScrollDirection>;
  offsetYAnchorOnBeginDrag: SharedValue<number>;
  offsetYAnchorOnChangeDirection: SharedValue<number>;
};

const AnimatedScrollContext = createContext<ContextValue>({} as ContextValue);

export const AnimatedScrollProvider: FC<PropsWithChildren> = ({ children }) => {
  const { netHeaderHeight } = useHomeHeaderHeight();

  const listRef = useRef<FlatList<any> | null>(null);

  const headerTop = useSharedValue(0);
  const isHeaderVisible = useDerivedValue(
    () => Math.abs(headerTop.get()) >= 0 && Math.abs(headerTop.get()) < netHeaderHeight
  );

  const offsetY = useSharedValue(0);
  const velocityYonEndDrag = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const handleListScrollEndDrag = (offsetYValue: number) => {
    listRef.current?.scrollToOffset({
      offset: offsetYValue,
      animated: true,
    });
  };

  const {
    onBeginDrag: directionOnBeginDrag,
    onScroll: directionOnScroll,
    scrollDirection,
    offsetYAnchorOnBeginDrag,
    offsetYAnchorOnChangeDirection,
  } = useScrollDirection();

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (event) => {
      isDragging.value = true;
      velocityYonEndDrag.set(0);
      directionOnBeginDrag(event);
    },
    onScroll: (event) => {
      const offsetYValue = event.contentOffset.y;
      offsetY.set(offsetYValue);

      directionOnScroll(event);
    },
    onEndDrag: (event) => {
      isDragging.value = false;
      velocityYonEndDrag.set(event.velocity?.y ?? 0);

      const headerTopTriggerDistance =
        Math.abs(headerTop.get()) >= 2 && Math.abs(headerTop.get()) < netHeaderHeight - 2;

      if (scrollDirection.get() === "to-bottom" && headerTopTriggerDistance) {
        const targetScrollOffset =
          event.contentOffset.y + (netHeaderHeight - Math.abs(headerTop.get()) + 2);
        runOnJS(handleListScrollEndDrag)(targetScrollOffset);
      }

      if (scrollDirection.get() === "to-top" && headerTopTriggerDistance) {
        const targetScrollOffset = event.contentOffset.y - netHeaderHeight - 2;
        runOnJS(handleListScrollEndDrag)(targetScrollOffset);
      }
    },
  });

  const value: ContextValue = {
    listRef,
    headerTop,
    isHeaderVisible,
    offsetY,
    velocityYonEndDrag,
    isDragging,
    scrollHandler,
    scrollDirection,
    offsetYAnchorOnBeginDrag,
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
