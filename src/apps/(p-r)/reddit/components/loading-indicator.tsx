import { FC } from "react";
import { usePullToRefresh } from "@/src/shared/components/with-pull-to-refresh";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const LoadingIndicator: FC = () => {
  const size = 70;
  const viewBox = `-5 -5 ${110} ${110}`;
  const refreshViewBaseHeight = 250; // Match the prop from home.tsx

  const { refreshing, refreshProgress, derivedRefreshOffsetY } = usePullToRefresh();

  const wasRefreshing = useSharedValue(false);
  const isPhase3 = useSharedValue(false);
  const animatedScale = useSharedValue(1);

  useDerivedValue(() => {
    const currentDerivedHeight = derivedRefreshOffsetY.get();
    const scaleTarget = 10;

    if (wasRefreshing.get() && !refreshing) {
      isPhase3.set(true);
      animatedScale.set(withTiming(scaleTarget, { duration: 120 }));
    }

    if (currentDerivedHeight < 1) {
      isPhase3.set(false);
      wasRefreshing.set(false);
      animatedScale.set(1);
    }

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
      [-size - 10, 5],
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

  return (
    <Animated.View className="items-center" style={rOuterContainerStyle}>
      <Animated.View
        className="absolute top-[5px] rounded-full w-[60px] h-[60px] bg-[#FF4400]"
        style={rBackgroundStyle}
      />
      <Svg viewBox={viewBox} width={size} height={size} fill="none">
        <Path
          fill="#FF4400"
          stroke="#FF4400"
          d="M50.506 100.5c27.614 0 49.994-22.368 49.994-49.989C100.5 22.891 78.114.5 50.5.5S.5 22.89.5 50.511c0 14.055 5.796 26.756 15.128 35.841l-9.817 9.736c-1.465 2.127-1.208 3.922 1.612 4.412h43.083Z"
        />
      </Svg>
    </Animated.View>
  );
};

export default LoadingIndicator;
