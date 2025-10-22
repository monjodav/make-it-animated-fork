/**
 * Special thanks to Matthew (https://x.com/matthew_3701) for sharing a universal pull-to-refresh approach:
 * https://github.com/MatthewSRC/native-springs/blob/main/PullRefresh/PullRefresh.tsx
 * This implementation adapts his idea to our needs.
 */
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
import { useScrollDirection } from "../lib/hooks/use-scroll-direction";
import { useHapticOnScroll } from "../lib/hooks/use-haptic-on-scroll";

interface WithPullToRefreshProps {
  children: ReactElement;
  refreshComponent: ReactElement;
  // Why: Pull distance needed to trigger refresh. Matches header base height by default
  // to keep visual/behavioral thresholds aligned. Tune per screen density.
  refreshThreshold?: number;
  refreshing: boolean;
  onRefresh: () => void;
  // Why: Resting height for the refresh view while loading. Keeps indicator visible
  // after release; large enough for spinners/labels but not obstructive.
  refreshViewBaseHeight?: number;
  // Why: When true, keeps header locked at the exact release height for snappier feel
  // (useful when indicator layout needs the extra space).
  lockRefreshViewOnRelease?: boolean;
  // Why: Duration for the snap-back motion when not refreshing and when refresh ends.
  // 400ms gives a natural deceleration without feeling sluggish.
  backAnimationDuration?: number;
  refreshComponentContainerClassName?: string;
  hapticFeedbackDirection?: "to-bottom" | "both";
}

// -----------------------------------------

const WithPullToRefreshContext = createContext<{
  refreshing: boolean;
  refreshProgress: DerivedValue<number>;
  refreshOffsetY: SharedValue<number>;
  derivedRefreshOffsetY: DerivedValue<number>;
  lockedRefreshOffsetY: SharedValue<number>;
} | null>(null);

export const usePullToRefresh = () => {
  const context = useContext(WithPullToRefreshContext);
  if (!context) {
    throw new Error("Must be used within WithPullToRefreshContext provider");
  }
  return context;
};

// -----------------------------------------

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
  hapticFeedbackDirection = "both",
}: WithPullToRefreshProps) {
  const { height: screenHeight } = useWindowDimensions();

  // Why: Live scroll offset from child list. Drives gesture gating (only when at top)
  // to avoid fighting with internal list physics.
  const listOffsetY = useSharedValue(0);
  // Why: Blocks new gestures while we animate header to target positions (prevents
  // re-entrancy and subtle translationY drift during animations).
  const isAnimating = useSharedValue(false);

  // Why: Raw finger-driven offset. We keep this separate from the displayed height so
  // we can dampen the header movement relative to finger travel.
  const refreshOffsetY = useSharedValue(0);
  // Why: Snapshot of release position used when locking the header at release height.
  const lockedRefreshOffsetY = useSharedValue(0);

  // Why: Dampen header stretch to 1/3 of finger movement for elastic feel and to
  // avoid oversized header inflation on long pulls.
  const derivedRefreshOffsetY = useDerivedValue(() => {
    return refreshOffsetY.get() / 3;
  });

  // Why: Normalized progress 0..1 used by refresh indicator animations.
  // Interpolation: input [0, refreshThreshold] -> output [0, 1] with CLAMP to prevent
  // overshooting beyond 1 when users over-pull.
  const refreshProgress = useDerivedValue(() => {
    if (refreshOffsetY.get() <= 1) return 0;
    return interpolate(refreshOffsetY.get(), [0, refreshThreshold], [0, 1], Extrapolation.CLAMP);
  });

  // Why: Track list scroll to know when we're at the very top. 16ms throttle (below)
  // keeps animations in sync at ~60fps without spam.
  const localScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      listOffsetY.set(event.contentOffset.y);
    },
  });

  const outerScrollHandler = (children as any).props?.onScroll;
  const handlers = outerScrollHandler
    ? [localScrollHandler, outerScrollHandler]
    : [localScrollHandler];

  // Why: Compose consumer's onScroll with ours so we don't break parent logic while
  // still capturing scroll for gating the pull-to-refresh.
  const onScroll = useComposedEventHandler(handlers);

  // Why: Bind header height to derived offset so heavy UI (blur/spinner) stays smooth
  // on the UI thread.
  const rHeaderStyle = useAnimatedStyle(() => {
    return { height: derivedRefreshOffsetY.get() };
  });

  // Why: Inject an animated header before user's header to host the refresh UI and
  // pass down onScroll + 16ms throttle for 60fps. Disable iOS bounce to prevent the
  // system overscroll from interfering with our gesture controller.
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
        {(children.props as any).ListHeaderComponent?.()}
      </>
    ),
    bounces: false,
  });

  const isListDragging = useSharedValue(false);
  const lastDragY = useSharedValue(0);

  const {
    onScroll: scrollDirectionOnScroll,
    scrollDirection,
    offsetYAnchorOnChangeDirection,
  } = useScrollDirection("include-negative");

  const { singleHapticOnScroll } = useHapticOnScroll({
    isListDragging,
    scrollDirection,
    offsetYAnchorOnChangeDirection,
    triggerOffset: refreshThreshold,
    hapticDirection: hapticFeedbackDirection,
  });

  // Why: Pan gesture orchestrates the pull. Enabled only when not already animating
  // or refreshing to avoid input/animation conflicts.
  const panGesture = Gesture.Pan()
    .enabled(!refreshing && !isAnimating.get())
    .activeOffsetY([-10, 10])
    .onBegin(() => {
      isListDragging.set(true);
      lastDragY.set(0);
      // Why is this needed? Because there's a subtle issue where translationY can continue updating
      // even after the animation has finished. By setting refreshOffsetY to a non-zero value here,
      // we ensure that the update logic in onChange only kicks in when a new touch actually begins,
      // avoiding interference from any incomplete touches.
      refreshOffsetY.set(1);
    })
    .onChange((e) => {
      // Why: Work with deltas to avoid frame-to-frame accumulation error.
      const deltaY = e.translationY - lastDragY.get();
      lastDragY.set(e.translationY);

      // Why: Only allow pulling when list is scrolled to top (<= 0). Once pulling,
      // continue responding even if listOffsetY fluctuates around 0. Clamp to screen
      // height to prevent runaway values on long drags.
      if (listOffsetY.get() <= 0 || refreshOffsetY.get() > 1) {
        const next = Math.max(0, Math.min(refreshOffsetY.get() + deltaY, screenHeight));
        refreshOffsetY.set(next);
        scrollDirectionOnScroll(next);
        singleHapticOnScroll(next);
      }
    })
    .onEnd(() => {
      // Why: Snapshot the release height for optional locking behavior.
      lockedRefreshOffsetY.set(refreshOffsetY.get());
      isAnimating.set(true);

      if (refreshOffsetY.get() >= refreshThreshold) {
        // Why: Crossed threshold — settle to loading height with spring for elastic feel.
        refreshOffsetY.set(
          withSpring(
            lockRefreshViewOnRelease ? lockedRefreshOffsetY.get() : refreshViewBaseHeight,
            {},
            (finished) => {
              if (finished) {
                isAnimating.set(false);
              }
            }
          )
        );
        // Why: Run on JS immediately after scheduling from UI thread without blocking
        // animations. Keeps gesture thread free while starting refresh work.
        scheduleOnRN(onRefresh);
      } else {
        // Why: Not enough pull — animate header back with a quick timing curve.
        refreshOffsetY.set(
          withTiming(0, { duration: backAnimationDuration }, (finished) => {
            if (finished) {
              isAnimating.set(false);
            }
          })
        );
      }

      isListDragging.set(false);
      lastDragY.set(0);
    });

  // Why: Allow native scroll to continue while our pan listens, avoiding gesture
  // ownership fights (Simultaneous resolves nested scroll + pull gestures cleanly).
  const nativeGesture = Gesture.Native();
  const composedGestures = Gesture.Simultaneous(panGesture, nativeGesture);

  // Why: When external refreshing flag flips to false, collapse the header. Timing
  // mirrors the non-refresh path for consistent motion language.
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
    refreshing,
    // Why: Consumers animate indicators using a normalized value (0..1), independent
    // of actual pixel pull distance.
    refreshProgress,
    // Why: Raw gesture offset for advanced consumers needing exact pull distance.
    refreshOffsetY,
    // Why: Damped header height used by this HOC to size the refresh container.
    derivedRefreshOffsetY,
    // Why: Release snapshot for lock-on-release behavior.
    lockedRefreshOffsetY,
  };

  return (
    <WithPullToRefreshContext.Provider value={contextValue}>
      <GestureDetector gesture={composedGestures}>{clonedChild}</GestureDetector>
    </WithPullToRefreshContext.Provider>
  );
}
