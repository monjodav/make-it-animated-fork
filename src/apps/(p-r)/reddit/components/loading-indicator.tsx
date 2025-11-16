import { FC } from "react";
import { usePullToRefresh } from "@/src/shared/components/with-pull-to-refresh";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { interpolatePath, parse } from "react-native-redash";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const PATH_VECTOR_1 = parse(
  "M101.5 51.012C101.5 23.115 78.89.5 51 .5S.5 23.115.5 51.012V115c0 14.012 5.707 26.701 14.919 35.851l-9.46 9.381-.034.034-.026.039c-.758 1.101-1.168 2.248-.868 3.247.314 1.043 1.32 1.682 2.807 1.94l.042.008h43.126c27.89 0 50.494-22.592 50.494-50.488v-64Z"
);
const PATH_VECTOR_2 = parse(
  "M 101.5 115.012 C 101.5 87.115 78.89 64.5 51 64.5 S 0.5 87.115 0.5 115.012 V 116 c 0 14.012 5.707 26.701 14.919 35.851 l -9.46 9.381 l -0.034 0.034 l -0.026 0.039 c -0.758 1.101 -1.168 2.248 -0.868 3.247 c 0.314 1.043 1.32 1.682 2.807 1.94 l 0.042 0.008 h 43.126 c 27.89 0 50.494 -22.592 50.494 -50.488 v -1 Z"
);

const SVG_HEIGHT = 80;

const LoadingIndicator: FC<{ refreshViewBaseHeight: number }> = ({ refreshViewBaseHeight }) => {
  const { refreshing, refreshProgress, derivedRefreshOffsetY } = usePullToRefresh();

  const wasRefreshing = useSharedValue(false);
  const isPhase3 = useSharedValue(false);
  const animatedScale = useSharedValue(1);
  const pathProgress = useSharedValue(0);
  const hasTriggeredPathAnimation = useSharedValue(false);
  const svgScale = useSharedValue(1);

  useDerivedValue(() => {
    const currentDerivedHeight = derivedRefreshOffsetY.get();
    const scaleTarget = 10;
    const progress = refreshProgress.get();

    // Trigger path animation when refreshProgress reaches 1
    if (progress >= 1 && !hasTriggeredPathAnimation.get()) {
      hasTriggeredPathAnimation.set(true);
      pathProgress.set(withSpring(1, { stiffness: 1500, damping: 20, mass: 1 }));
      // Start heart pumping animation with sequence

      svgScale.set(
        withRepeat(
          withSequence(withTiming(1.01, { duration: 200 }), withTiming(0.99, { duration: 200 })),
          -1,
          false
        )
      );
    }

    // Reset animations when pull resets
    if (progress < 0.1) {
      hasTriggeredPathAnimation.set(false);
      pathProgress.set(0);
      svgScale.set(1);
    }

    // Handle scaling animation during refresh phases
    if (wasRefreshing.get() && !refreshing) {
      isPhase3.set(true);
      animatedScale.set(withTiming(scaleTarget, { duration: 120 }));
    }
    // Reset states after phase 3 completes
    if (currentDerivedHeight < 1) {
      isPhase3.set(false);
      wasRefreshing.set(false);
      animatedScale.set(1);
    }
    // Mark that we are refreshing
    if (refreshing) {
      wasRefreshing.set(true);
    }
  });

  const rOuterContainerStyle = useAnimatedStyle(() => {
    const currentDerivedHeight = derivedRefreshOffsetY.get();
    const derivedBaseHeight = refreshViewBaseHeight / 3;
    const progress = refreshProgress.get();

    // Phase 1: Pull down - indicator appears slowly using refreshProgress
    // Phase 2: Settled at base height - indicator stays at visible position
    // Phase 3: Collapsing - indicator disappears (moves from visible to hidden)
    const pullProgress = interpolate(progress, [0, 1], [0, 1], Extrapolation.CLAMP);

    const collapseProgress = interpolate(
      currentDerivedHeight,
      [0, derivedBaseHeight],
      [0, 1],
      Extrapolation.CLAMP
    );

    // Use pullProgress when pulling (progress < 1), otherwise use collapseProgress
    const finalProgress = progress < 1 && !refreshing ? pullProgress : collapseProgress;

    const indicatorPosition = interpolate(
      finalProgress,
      [0, 1],
      [-SVG_HEIGHT - 10, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        {
          translateY: indicatorPosition,
        },
      ],
    };
  });

  const rBackgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedScale.get() }],
    };
  });

  const svgAnimatedProps = useAnimatedProps(() => {
    const animatedPathProgress = pathProgress.get();
    const d = interpolatePath(animatedPathProgress, [0, 1], [PATH_VECTOR_1, PATH_VECTOR_2]);
    return {
      d,
    };
  });

  const rSvgScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: svgScale.get() }],
    };
  });

  return (
    <Animated.View className="items-center" style={rOuterContainerStyle}>
      <Animated.View
        className="absolute top-[11px] rounded-full w-[55px] h-[55px] bg-[#FF4400]"
        style={rBackgroundStyle}
      />
      <AnimatedSvg
        style={rSvgScaleStyle}
        width={SVG_HEIGHT - 10}
        height={SVG_HEIGHT}
        viewBox={"0 35 105 45"}
        fill="none"
      >
        <AnimatedPath animatedProps={svgAnimatedProps} fill="#FF4400" />
      </AnimatedSvg>
    </Animated.View>
  );
};

export default LoadingIndicator;
