import Animated, {
  interpolate,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { CHEVRON_WIDTH, CHEVRON_RISE, LINE_THICKNESS, TRIGGER_THRESHOLD } from "./constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

interface ChevronIndicatorProps {
  scrollY: SharedValue<number>;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const ChevronIndicator = ({ scrollY }: ChevronIndicatorProps) => {
  const insets = useSafeAreaInsets();

  const rChevronMetrics = useDerivedValue(() => {
    const progress = Math.abs(scrollY.get() / TRIGGER_THRESHOLD);
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
    return {
      d: `M${left} ${vOffset} L ${midX} ${midY} L ${right} ${vOffset}`,
      strokeWidth: strokeW,
    };
  });

  const rChevronContainerStyle = useAnimatedStyle(() => {
    const progress = Math.abs(scrollY.get());
    return { height: interpolate(progress, [0, TRIGGER_THRESHOLD], [1, TRIGGER_THRESHOLD]) };
  });

  return (
    <Animated.View
      style={[rChevronContainerStyle, { top: insets.top + 12 }]}
      className="absolute left-0 right-0 self-center items-center justify-center"
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
            stroke="#484848"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </Animated.View>
  );
};
