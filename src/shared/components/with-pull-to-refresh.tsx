import React, { cloneElement, createContext, ReactElement, useContext, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  DerivedValue,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useComposedEventHandler,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { cn } from "../lib/utils/cn";

interface WithPullToRefreshProps {
  children: ReactElement;
  refreshComponent: ReactElement;
  refreshThreshold?: number;
  refreshing: boolean;
  onRefresh: () => void;
  refreshViewBaseHeight?: number;
  lockRefreshViewOnRelease?: boolean;
  backAnimationDuration?: number;
  refreshComponentContainerClassName?: string;
}

const WithPullToRefreshContext = createContext<{
  refreshProgress: DerivedValue<number>;
  refreshOffsetY: SharedValue<number>;
  derivedRefreshOffsetY: DerivedValue<number>;
  lockedRefreshOffsetY: SharedValue<number>;
  isAnimatingRefresh: SharedValue<boolean>;
} | null>(null);

export const usePullToRefresh = () => {
  const context = useContext(WithPullToRefreshContext);
  if (!context) {
    throw new Error("Must be used within WithPullToRefreshContext provider");
  }
  return context;
};

export function WithPullToRefresh({
  children,
  refreshComponent,
  refreshThreshold = 200,
  refreshing,
  onRefresh,
  refreshViewBaseHeight = 200,
  lockRefreshViewOnRelease = false,
  backAnimationDuration = 400,
  refreshComponentContainerClassName,
}: WithPullToRefreshProps) {
  const { height: screenHeight } = useWindowDimensions();

  const listOffsetY = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  const isAnimatingRefresh = useSharedValue(false);

  const refreshOffsetY = useSharedValue(0);
  const lockedRefreshOffsetY = useSharedValue(0);

  const derivedRefreshOffsetY = useDerivedValue(() => {
    return refreshOffsetY.get() / 3;
  });

  const refreshProgress = useDerivedValue(() => {
    if (refreshOffsetY.get() <= 1) return 0;
    return interpolate(refreshOffsetY.get(), [0, refreshThreshold], [0, 1], Extrapolation.CLAMP);
  });

  const localScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      listOffsetY.set(event.contentOffset.y);
    },
  });

  const outerScrollHandler = (children as any).props?.onScroll;
  const handlers = outerScrollHandler
    ? [localScrollHandler, outerScrollHandler]
    : [localScrollHandler];

  const onScroll = useComposedEventHandler(handlers);

  const rHeaderStyle = useAnimatedStyle(() => {
    return { height: derivedRefreshOffsetY.get() };
  });

  const clonedChild = cloneElement(children as any, {
    onScroll,
    scrollEventThrottle: 16,
    ListHeaderComponent: (
      <>
        <Animated.View
          className={cn("items-center justify-center", refreshComponentContainerClassName)}
          style={rHeaderStyle}
        >
          {refreshComponent}
        </Animated.View>
        {(children.props as any).ListHeaderComponent()}
      </>
    ),
    bounces: false,
  });

  const lastDragY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(!refreshing && !isAnimating.get())
    .onBegin(() => {
      lastDragY.set(0);
      // Why is this needed? Because there's a subtle issue where translationY can continue updating
      // even after the animation has finished. By setting refreshOffsetY to a non-zero value here,
      // we ensure that the update logic in onChange only kicks in when a new touch actually begins,
      // avoiding interference from any incomplete touches.
      refreshOffsetY.set(1);
    })
    .onChange((e) => {
      const deltaY = e.translationY - lastDragY.get();
      lastDragY.set(e.translationY);

      if (listOffsetY.get() <= 0 || refreshOffsetY.get() > 1) {
        const next = Math.max(0, Math.min(refreshOffsetY.get() + deltaY, screenHeight));
        refreshOffsetY.set(next);
      }
    })
    .onEnd(() => {
      lockedRefreshOffsetY.set(refreshOffsetY.get());
      isAnimating.set(true);

      if (refreshOffsetY.get() >= refreshThreshold) {
        isAnimatingRefresh.set(true);
        refreshOffsetY.set(
          withSpring(
            lockRefreshViewOnRelease ? lockedRefreshOffsetY.get() : refreshViewBaseHeight,
            {},
            (finished) => {
              if (finished) {
                isAnimating.set(false);
                isAnimatingRefresh.set(false);
              }
            }
          )
        );
        scheduleOnRN(onRefresh);
      } else {
        refreshOffsetY.set(
          withTiming(0, { duration: backAnimationDuration }, (finished) => {
            if (finished) {
              isAnimating.set(false);
            }
          })
        );
      }

      lastDragY.set(0);
    });

  const nativeGesture = Gesture.Native();
  const composedGestures = Gesture.Simultaneous(panGesture, nativeGesture);

  useEffect(() => {
    if (!refreshing) {
      isAnimating.set(true);
      refreshOffsetY.set(
        withTiming(0, { duration: backAnimationDuration }, (finished) => {
          if (finished) isAnimating.set(false);
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing]);

  const contextValue = {
    refreshProgress,
    refreshOffsetY,
    derivedRefreshOffsetY,
    lockedRefreshOffsetY,
    isAnimatingRefresh,
  };

  return (
    <WithPullToRefreshContext.Provider value={contextValue}>
      <GestureDetector gesture={composedGestures}>{clonedChild}</GestureDetector>
    </WithPullToRefreshContext.Provider>
  );
}
