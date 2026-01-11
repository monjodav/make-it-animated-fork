import { createContext, useMemo, type PropsWithChildren } from "react";
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
  activeIndexProgress: SharedValue<number>;
  scrollOffsetX: SharedValue<number>;
  monthWidths: SharedValue<number[]>;
  monthsScrollRef: ReturnType<typeof useAnimatedRef<Animated.ScrollView>>;
  daysScrollRef: ReturnType<typeof useAnimatedRef<Animated.ScrollView>>;
  gamesScrollRef: ReturnType<typeof useAnimatedRef<Animated.ScrollView>>;
};

export const CalendarAnimatedContext = createContext<CalendarAnimatedContextType>(
  {} as CalendarAnimatedContextType
);

export const CalendarAnimatedProvider = ({ children }: PropsWithChildren) => {
  const monthWidths = useSharedValue<number[]>(new Array(MONTHS_LENGTH).fill(0));

  const scrollOffsetX = useSharedValue(0);
  const activeIndexProgress = useSharedValue(0);

  const monthsScrollRef = useAnimatedRef<Animated.ScrollView>();
  const daysScrollRef = useAnimatedRef<Animated.ScrollView>();
  const gamesScrollRef = useAnimatedRef<Animated.ScrollView>();

  const contextValue = useMemo(
    () => ({
      activeIndexProgress,
      scrollOffsetX,
      monthWidths,
      monthsScrollRef,
      daysScrollRef,
      gamesScrollRef,
    }),
    [
      activeIndexProgress,
      scrollOffsetX,
      monthWidths,
      monthsScrollRef,
      daysScrollRef,
      gamesScrollRef,
    ]
  );

  return (
    <CalendarAnimatedContext.Provider value={contextValue}>
      {children}
    </CalendarAnimatedContext.Provider>
  );
};
