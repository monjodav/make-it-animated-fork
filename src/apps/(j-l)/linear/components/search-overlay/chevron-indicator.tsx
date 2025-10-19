import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useDerivedValue,
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

  const rChevronMetrics = useDerivedValue(() => {
    const progressAdj = Math.pow(refreshProgress.get(), 0.85);
    const midDrop = CHEVRON_RISE * progressAdj;
    const strokeW = LINE_THICKNESS;
    return { midDrop, strokeW };
  });

  const animatedPathProps = useAnimatedProps(() => {
    const { midDrop, strokeW } = rChevronMetrics.get();

    const chevronWidth = interpolate(
      refreshProgress.get(),
      [0, 1],
      [CHEVRON_WIDTH, CHEVRON_WIDTH * 0.85]
    );

    const vOffset = strokeW / 2;
    const hInset = strokeW / 2;
    const left = hInset;
    const right = 2 * chevronWidth - hInset;
    const midX = chevronWidth;
    const midY = (midDrop + vOffset).toFixed(3);

    const stroke = interpolateColor(refreshProgress.get(), [0, 1], ["#525252", "#737373"]);

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
