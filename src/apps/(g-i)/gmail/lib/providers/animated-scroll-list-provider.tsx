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

type AnimatedScrollListContextType = {
  listRef: React.RefObject<FlatList<any>>;
  listOffsetY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  scrollDirection: ScrollDirectionValue;
  offsetYAnchorOnBeginDrag: SharedValue<number>;
  offsetYAnchorOnChangeDirection: SharedValue<number>;
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
};

const AnimatedScrollListContext = createContext<AnimatedScrollListContextType>(
  {} as AnimatedScrollListContextType
);

export const AnimatedScrollListProvider: FC<PropsWithChildren> = ({ children }) => {
  const listRef = useRef<FlatList>(null);

  const listOffsetY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const {
    scrollDirection,
    offsetYAnchorOnBeginDrag,
    offsetYAnchorOnChangeDirection,
    onBeginDrag: scrollDirectionOnBeginDrag,
    onScroll: scrollDirectionOnScroll,
  } = useScrollDirection();

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (e) => {
      isDragging.value = true;
      scrollDirectionOnBeginDrag(e);
    },
    onScroll: (e) => {
      listOffsetY.value = e.contentOffset.y;
      scrollDirectionOnScroll(e);
    },
    onEndDrag: () => {
      isDragging.value = false;
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

export const useAnimatedScrollList = () => {
  const context = useContext(AnimatedScrollListContext);

  if (!context) {
    throw new Error("useAnimatedScrollList must be used within an AnimatedScrollListProvider");
  }

  return context;
};

// gmail-bottom-tab-bar-and-fab-animation 🔼
// gmail-header-scroll-animation 🔼
