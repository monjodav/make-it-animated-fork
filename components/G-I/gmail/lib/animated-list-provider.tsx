import {
  ScrollDirectionValue,
  useAbsoluteScrollDirection,
} from "@/hooks/use-absolute-scroll-direction";
import { createContext, FC, PropsWithChildren, useContext } from "react";
import {
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

type AnimatedListContextType = {
  listOffsetY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  scrollDirection: ScrollDirectionValue;
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
};

const AnimatedListContext = createContext<AnimatedListContextType>({} as AnimatedListContextType);

export const AnimatedListProvider: FC<PropsWithChildren> = ({ children }) => {
  const listOffsetY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const { scrollDirection, onScroll: scrollDirectionOnScroll } = useAbsoluteScrollDirection();

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isDragging.value = true;
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
        listOffsetY,
        isDragging,
        scrollDirection,
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
