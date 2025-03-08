import {
  ScrollDirectionValue,
  useAbsoluteScrollDirection,
} from "@/hooks/use-absolute-scroll-direction";
import { createContext, FC, PropsWithChildren, useContext, useRef } from "react";
import { FlatList } from "react-native";
import {
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

// gmail-header-scroll-animation 🔽

type AnimatedListContextType = {
  listRef: React.RefObject<FlatList<any>>;
  listOffsetY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  scrollDirection: ScrollDirectionValue;
  offsetYAnchorOnBeginDrag: SharedValue<number>;
  offsetYAnchorOnChangeDirection: SharedValue<number>;
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
};

const AnimatedListContext = createContext<AnimatedListContextType>({} as AnimatedListContextType);

export const AnimatedListProvider: FC<PropsWithChildren> = ({ children }) => {
  const listRef = useRef<FlatList>(null);

  const listOffsetY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const {
    scrollDirection,
    offsetYAnchorOnBeginDrag,
    offsetYAnchorOnChangeDirection,
    onBeginDrag: scrollDirectionOnBeginDrag,
    onScroll: scrollDirectionOnScroll,
  } = useAbsoluteScrollDirection();

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
    <AnimatedListContext.Provider
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
    </AnimatedListContext.Provider>
  );
};

export const useAnimatedList = () => {
  const context = useContext(AnimatedListContext);

  if (!context) {
    throw new Error("useAnimatedList must be used within an AnimatedListProvider");
  }

  return context;
};

// gmail-header-scroll-animation 🔼
