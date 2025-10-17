import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { BAR_WIDTH, CHEVRON_RISE, LINE_THICKNESS } from "./constants";

interface ChevronIndicatorProps {
  morphProgress: SharedValue<number>;
  chevronContainerStyle: any;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const ChevronIndicator = ({
  morphProgress,
  chevronContainerStyle,
}: ChevronIndicatorProps) => {
  const rChevronMetrics = useDerivedValue(() => {
    const progress = morphProgress.get();
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
    const right = 2 * BAR_WIDTH - hInset;
    const midX = BAR_WIDTH;
    const midY = (midDrop + vOffset).toFixed(3);
    return {
      d: `M${left} ${vOffset} L ${midX} ${midY} L ${right} ${vOffset}`,
      strokeWidth: strokeW,
    };
  });

  const rChevronStyle = useAnimatedStyle(() => {
    const { midDrop } = rChevronMetrics.get();
    const translateY = -(midDrop / 2);
    return { transform: [{ translateY }] };
  });

  return (
    <Animated.View
      style={chevronContainerStyle}
      className="self-center items-center justify-center pt-3 pb-1"
    >
      <Animated.View style={rChevronStyle}>
        <Svg
          width={BAR_WIDTH * 2}
          height={CHEVRON_RISE + LINE_THICKNESS * 2}
          viewBox={`0 0 ${BAR_WIDTH * 2} ${CHEVRON_RISE + LINE_THICKNESS * 2}`}
          fill="none"
        >
          <AnimatedPath
            animatedProps={animatedPathProps}
            stroke="#484848"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
};
