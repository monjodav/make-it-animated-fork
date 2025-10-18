import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { CHEVRON_WIDTH, CHEVRON_RISE, LINE_THICKNESS, TRIGGER_THRESHOLD } from "./constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

interface ChevronIndicatorProps {
  scrollY: SharedValue<number>;
  isTriggerThresholdReached: SharedValue<boolean>;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const ChevronIndicator = ({ scrollY, isTriggerThresholdReached }: ChevronIndicatorProps) => {
  const insets = useSafeAreaInsets();
  const lockedScrollY = useSharedValue(0);

  useAnimatedReaction(
    () => isTriggerThresholdReached.get(),
    (reached) => {
      if (reached) {
        lockedScrollY.set(scrollY.get());
      }
    }
  );

  const rChevronMetrics = useDerivedValue(() => {
    const thresholdReached = isTriggerThresholdReached.get();
    const yValue = thresholdReached ? lockedScrollY.get() : scrollY.get();
    const progress = yValue < 0 ? Math.abs(yValue / TRIGGER_THRESHOLD) : 0;
    const progressAdj = Math.pow(progress, 0.85);
    const midDrop = CHEVRON_RISE * progressAdj;
    const strokeW = LINE_THICKNESS;
    return { midDrop, strokeW };
  });

  const animatedPathProps = useAnimatedProps(() => {
    const { midDrop, strokeW } = rChevronMetrics.get();
    const vOffset = strokeW / 2;
    const hInset = strokeW / 2;
    const left = hInset;
    const right = 2 * CHEVRON_WIDTH - hInset;
    const midX = CHEVRON_WIDTH;
    const midY = (midDrop + vOffset).toFixed(3);

    const thresholdReached = isTriggerThresholdReached.get();
    const yValue = thresholdReached ? lockedScrollY.get() : scrollY.get();
    const progress = yValue < 0 ? Math.min(Math.abs(yValue / TRIGGER_THRESHOLD), 1) : 0;
    const stroke = interpolateColor(progress, [0, 1], ["#484848", "#c3c3c3"]);

    return {
      d: `M${left} ${vOffset} L ${midX} ${midY} L ${right} ${vOffset}`,
      strokeWidth: strokeW,
      stroke,
    };
  });

  const rChevronContainerStyle = useAnimatedStyle(() => {
    const thresholdReached = isTriggerThresholdReached.get();
    const yValue = thresholdReached ? lockedScrollY.get() : scrollY.get();

    return {
      height: interpolate(yValue, [0, -TRIGGER_THRESHOLD], [0, TRIGGER_THRESHOLD], {
        extrapolateLeft: "clamp",
      }),
      position: thresholdReached ? "relative" : "absolute",
      top: thresholdReached ? 0 : insets.top + 12,
    };
  });

  return (
    <Animated.View
      style={rChevronContainerStyle}
      className="absolute left-0 right-0 w-full self-center items-center justify-center"
    >
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
    </Animated.View>
  );
};
