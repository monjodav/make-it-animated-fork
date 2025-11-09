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

// linear-search-screen-open-close-animation 🔽

// createAnimatedComponent (why): enables animating SVG Path props (d, strokeWidth, stroke)
// See: https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Visual constants (why): define chevron geometry/weight independent from animation state
export const CHEVRON_WIDTH = 24;
export const LINE_THICKNESS = 5;

// Angle is expressed both in deg/rad for readability and math
export const CHEVRON_ANGLE_DEG = 30;
export const CHEVRON_ANGLE_RAD = (CHEVRON_ANGLE_DEG * Math.PI) / 180;

// Vertical rise of the chevron sides given the angle and width
export const CHEVRON_RISE = Math.tan(CHEVRON_ANGLE_RAD) * CHEVRON_WIDTH;

export const ChevronIndicator = () => {
  const { transitionProgress } = use(SearchTransitionContext);
  const { refreshProgress } = usePullToRefresh();

  // Entrance animation: starts at 1 (open), animates to 0 (closed)
  const entranceProgress = useSharedValue(1);

  useAnimatedReaction(
    () => transitionProgress.get(),
    (transition) => {
      // Start entrance → closed spring once modal transition crosses threshold.
      // Long-duration spring gives soft settle as the refresh chevron appears.
      if (transition > 0.75 && entranceProgress.get() === 1) {
        entranceProgress.set(withSpring(0, { duration: 1500, dampingRatio: 0.75 }));
      }
    }
  );

  const combinedProgress = useDerivedValue(() => {
    const entrance = entranceProgress.get();
    const refresh = refreshProgress.get();

    // Use entrance animation, then switch to refresh progress
    // Rationale: keep a single driver for geometry/color while handoff occurs
    return Math.max(entrance, refresh);
  });

  const rChevronMetrics = useDerivedValue(() => {
    // Ease the input to bias more motion early in the drag (sublinear pow)
    const progressAdj = Math.pow(combinedProgress.get(), 0.85);
    const midDrop = CHEVRON_RISE * progressAdj;
    const strokeW = LINE_THICKNESS;
    return { midDrop, strokeW };
  });

  const animatedPathProps = useAnimatedProps(() => {
    const { midDrop, strokeW } = rChevronMetrics.get();

    // Width subtly compacts on pull to suggest resistance (15% reduction at max)
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

    // Stroke color lightens as progress increases (subtle affordance)
    const stroke = interpolateColor(combinedProgress.get(), [0, 1], ["#525252", "#737373"]);

    return {
      // Path updates are fully driven by animated props for 60fps SVG redraws
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

// linear-search-screen-open-close-animation 🔼
