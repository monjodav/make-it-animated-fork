import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
import { usePullToRefresh } from "@/src/shared/components/with-pull-to-refresh";
import { SearchTransitionContext } from "@/app/(apps)/(j-l)/linear/_layout";
import { use } from "react";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const CHEVRON_WIDTH = 24;
export const LINE_THICKNESS = 5;

export const CHEVRON_ANGLE_DEG = 30;
export const CHEVRON_ANGLE_RAD = (CHEVRON_ANGLE_DEG * Math.PI) / 180;

export const CHEVRON_RISE = Math.tan(CHEVRON_ANGLE_RAD) * CHEVRON_WIDTH;

export const ChevronIndicator = () => {
  const { transitionProgress } = use(SearchTransitionContext);
  const { refreshProgress } = usePullToRefresh();

  // Entrance animation: starts at 1 (open), animates to 0 (closed)
  const entranceProgress = useSharedValue(1);

  useAnimatedReaction(
    () => transitionProgress.get(),
    (transition) => {
      if (transition > 0.75 && entranceProgress.get() === 1) {
        entranceProgress.set(withSpring(0, { duration: 1500, dampingRatio: 0.75 }));
      }
    }
  );

  const combinedProgress = useDerivedValue(() => {
    const entrance = entranceProgress.get();
    const refresh = refreshProgress.get();

    // Use entrance animation, then switch to refresh progress
    return Math.max(entrance, refresh);
  });

  const rChevronMetrics = useDerivedValue(() => {
    const progressAdj = Math.pow(combinedProgress.get(), 0.85);
    const midDrop = CHEVRON_RISE * progressAdj;
    const strokeW = LINE_THICKNESS;
    return { midDrop, strokeW };
  });

  const animatedPathProps = useAnimatedProps(() => {
    const { midDrop, strokeW } = rChevronMetrics.get();

    const chevronWidth = interpolate(
      combinedProgress.get(),
      [0, 1],
      [CHEVRON_WIDTH, CHEVRON_WIDTH * 0.85]
    );

    const vOffset = strokeW / 2;
    const hInset = strokeW / 2;
    const left = hInset;
    const right = 2 * chevronWidth - hInset;
    const midX = chevronWidth;
    const midY = (midDrop + vOffset).toFixed(3);

    const stroke = interpolateColor(combinedProgress.get(), [0, 1], ["#525252", "#737373"]);

    return {
      d: `M${left} ${vOffset} L ${midX} ${midY} L ${right} ${vOffset}`,
      strokeWidth: strokeW,
      stroke,
    };
  });

  return (
    <View style={{ transform: [{ translateY: CHEVRON_RISE }] }}>
      <Svg
        width={CHEVRON_WIDTH * 2}
        height={(CHEVRON_RISE + LINE_THICKNESS) * 2}
        viewBox={`0 0 ${CHEVRON_WIDTH * 2} ${(CHEVRON_RISE + LINE_THICKNESS) * 2}`}
        fill="none"
      >
        <AnimatedPath
          animatedProps={animatedPathProps}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};
